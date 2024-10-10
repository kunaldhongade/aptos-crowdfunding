import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, message, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

interface Project {
  id: number;
  title: string;
  description: string;
  goal: number;
  total_funds_raised: number;
  creator: string;
}

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [projectsCreated, setProjectsCreated] = useState<Project[]>([]);

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const fetchAllProjectsByCreator = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::CrowdfundingPlatform::view_projects_by_creator`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const projectList = result[0];

      if (Array.isArray(projectList)) {
        setProjectsCreated(
          projectList.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            goal: project.goal,
            total_funds_raised: project.total_funds_raised,
            creator: project.creator,
          })),
        );
      } else {
        setProjectsCreated([]);
      }
    } catch (error) {
      console.error("Failed to get Projects by address:", error);
    }
  };

  const handleCreateProject = async (values: Project) => {
    try {
      const goalAmount = convertAmountFromHumanReadableToOnChain(values.goal, 8);

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::CrowdfundingPlatform::create_project`,
          functionArguments: [values.title, values.description, goalAmount],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Project Created Successfully!");
      fetchAllProjectsByCreator();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error creating Policy.", error);
    }
  };

  useEffect(() => {
    fetchAllProjectsByCreator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, projectsCreated]);

  return (
    <>
      <LaunchpadHeader title="Create Campaign" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Create Campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleCreateProject}
                labelCol={{
                  span: 4.04,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                  <Input placeholder="Project Title" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input placeholder="Project Description" />
                </Form.Item>

                <Form.Item label="Goal (APT)" name="goal" rules={[{ required: true }]}>
                  <Input placeholder="Funding Goal (APT)" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Create Campaign
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Projects Created By You</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsCreated.map((project, index) => (
                <Card key={index} className="mb-6 shadow-lg p-4">
                  <Paragraph>
                    <strong>Project ID:</strong> {project.id}
                  </Paragraph>
                  <Paragraph>
                    <strong>Title:</strong> {project.title}
                  </Paragraph>
                  <Paragraph>
                    <strong>Description:</strong> {project.description}
                  </Paragraph>
                  <Paragraph>
                    <strong>Goal (APT):</strong> <Tag>{convertAmountFromOnChainToHumanReadable(project.goal, 8)}</Tag>
                  </Paragraph>
                  <Paragraph>
                    <strong>Total Funds Raised (APT):</strong>{" "}
                    <Tag>{convertAmountFromOnChainToHumanReadable(project.total_funds_raised, 8)}</Tag>
                  </Paragraph>
                  <Paragraph>
                    <strong>Creator Address:</strong> <Tag>{project.creator}</Tag>
                  </Paragraph>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
