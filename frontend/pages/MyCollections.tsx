import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, message, Progress, Table, Tag, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;
const { Paragraph } = Typography;

interface Project {
  id: number;
  title: string;
  description: string;
  goal: number;
  total_funds_raised: number;
  creator: string;
}

interface Donation {
  backer: string;
  project_id: number;
  amount: number;
  timestamp: number;
}
export function MyCollections() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [donationsMade, setDonationsMade] = useState<Donation[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

  const calculateProgress = (raised: number, goal: number) => {
    return (raised / goal) * 100;
  };

  const handleFetchProjectById = async (values: { project_id: number }) => {
    try {
      const { project_id } = values;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::CrowdfundingPlatform::view_project_by_id`,
        functionArguments: [project_id],
      };

      const result = await aptosClient().view({ payload });

      if (result && result[0]) {
        const project = result[0] as Project;
        setProjectDetails({
          id: project.id,
          title: project.title,
          description: project.description,
          goal: project.goal,
          total_funds_raised: project.total_funds_raised,
          creator: project.creator,
        });
      } else {
        setProjectDetails(null);
        message.error("Project not found.");
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
      message.error("Error fetching project details.");
    }
  };

  const fetchAllProjects = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::CrowdfundingPlatform::view_all_projects`,
        functionArguments: [],
      };

      const result = await aptosClient().view({ payload });
      const projectList = result[0];

      if (Array.isArray(projectList)) {
        setAllProjects(
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
        setAllProjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
    }
  };

  const fetchAllDonationsByBacker = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::CrowdfundingPlatform::view_donations_by_backer`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const donationList = result[0];

      if (Array.isArray(donationList)) {
        setDonationsMade(
          donationList.map((donation) => ({
            backer: donation.backer,
            project_id: donation.project_id,
            amount: donation.amount,
            timestamp: donation.timestamp,
          })),
        );
      } else {
        setDonationsMade([]);
      }
    } catch (error) {
      console.error("Failed to fetch donations by backer:", error);
    }
  };

  const handleBackProject = async (values: { project_id: number; amount: number }) => {
    try {
      const amountInAPT = convertAmountFromHumanReadableToOnChain(values.amount, 8);

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::CrowdfundingPlatform::back_project`,
          functionArguments: [values.project_id, amountInAPT],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Successfully backed the project!");
      fetchAllDonationsByBacker();
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
      console.log("Error Verifying Claim.", error);
    }
  };

  useEffect(() => {
    fetchAllDonationsByBacker();
    fetchAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <LaunchpadHeader title="All Campaigns" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>All Available Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={allProjects} rowKey="id" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="id" />
                <Column title="Title" dataIndex="title" />
                <Column
                  title="Goal (APT)"
                  dataIndex="goal"
                  responsive={["md"]}
                  render={(goal: number) => convertAmountFromOnChainToHumanReadable(goal, 8)}
                />
                <Column
                  title="Total Raised (APT)"
                  dataIndex="total_funds_raised"
                  responsive={["md"]}
                  render={(total_funds_raised: number) =>
                    convertAmountFromOnChainToHumanReadable(total_funds_raised, 8)
                  }
                />
                <Column
                  title="Creator"
                  dataIndex="creator"
                  responsive={["md"]}
                  render={(creator: string) => creator.substring(0, 6) + "..." + creator.slice(-4)}
                />
                <Column
                  title="Description"
                  dataIndex="description"
                  responsive={["lg"]}
                  render={(description: string) =>
                    description.length > 100 ? `${description.substring(0, 100)}...` : description
                  }
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>View Project by ID</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleFetchProjectById}
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
                <Form.Item label="Project ID" name="project_id" rules={[{ required: true }]}>
                  <Input placeholder="Enter Project ID" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Fetch Project
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          {/* Display Project Details in Card if Available */}
          {projectDetails && (
            <Card>
              <CardHeader>
                <CardDescription>Project Details</CardDescription>
              </CardHeader>
              <CardContent>
                <Paragraph>
                  <strong>Project ID:</strong> {projectDetails.id}
                </Paragraph>
                <Paragraph>
                  <strong>Title:</strong> {projectDetails.title}
                </Paragraph>
                <Paragraph>
                  <strong>Description:</strong> {projectDetails.description}
                </Paragraph>
                <Paragraph>
                  <strong>Goal (APT):</strong>{" "}
                  <Tag>{convertAmountFromOnChainToHumanReadable(projectDetails.goal, 8)}</Tag>
                </Paragraph>
                <Paragraph>
                  <strong>Total Funds Raised (APT):</strong>{" "}
                  <Tag>{convertAmountFromOnChainToHumanReadable(projectDetails.total_funds_raised, 8)}</Tag>
                </Paragraph>
                <Paragraph>
                  <strong>Creator Address:</strong> <Tag>{projectDetails.creator}</Tag>
                </Paragraph>
                <Paragraph>
                  <Tag>Progress Bar Of the Project</Tag>
                </Paragraph>
                {/* Progress Bar for Funds Raised */}
                <Progress
                  percent={calculateProgress(
                    convertAmountFromOnChainToHumanReadable(projectDetails.total_funds_raised, 8),
                    convertAmountFromOnChainToHumanReadable(projectDetails.goal, 8),
                  )}
                  status={projectDetails.total_funds_raised >= projectDetails.goal ? "success" : "active"}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardDescription>Support Campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleBackProject}
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
                <Form.Item label="Project ID" name="project_id" rules={[{ required: true }]}>
                  <Input placeholder="Enter Project ID" />
                </Form.Item>

                <Form.Item label="Amount (APT)" name="amount" rules={[{ required: true }]}>
                  <Input placeholder="Enter Amount to Back (APT)" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Support Campaign
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Your Donations</CardDescription>
            </CardHeader>
            <CardContent>
              {donationsMade.map((donation, index) => (
                <Card key={index} className="mb-6 shadow-lg p-4">
                  <Paragraph>
                    <strong>Project ID:</strong> {donation.project_id}
                  </Paragraph>
                  <Paragraph>
                    <strong>Amount Donated (APT):</strong>{" "}
                    <Tag>{convertAmountFromOnChainToHumanReadable(donation.amount, 8)}</Tag>
                  </Paragraph>
                  <Paragraph>
                    <strong>Timestamp:</strong> {new Date(donation.timestamp * 1000).toLocaleString()}
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
