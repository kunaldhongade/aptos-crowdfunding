import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/crowdfunding_project",
    discord: "https://discord.com/invite/crowdfunding",
    homepage: "https://crowdfundingproject.com",
  },

  defaultCollection: {
    name: "Crowdfunding Collection",
    description: "Explore the unique and innovative projects on our crowdfunding platform.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Mission",
    subTitle: "Empowering Ideas through Crowdfunding",
    description:
      "At our crowdfunding platform, we are committed to supporting innovative ideas and projects. Join us in empowering creators and bringing their visions to life.",
    discordLink: "https://discord.com/invite/crowdfunding",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alice",
        role: "Project Lead",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com/alice_lead",
        },
      },
      {
        name: "Bob",
        role: "Marketing Manager",
        img: Placeholder2,
      },
      {
        name: "Charlie",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com/charlie_community",
        },
      },
    ],
  },

  faqs: {
    title: "Frequently Asked Questions",

    questions: [
      {
        title: "What is our crowdfunding platform?",
        description:
          "Our platform is designed to help creators raise funds for their innovative projects through community support.",
      },
      {
        title: "How do I start a project?",
        description: `To start a project, follow these steps:
        Visit our homepage and create an account.
        Submit your project proposal for review.
        Launch your campaign and start raising funds.`,
      },
      {
        title: "How can I support a project?",
        description:
          "You can support a project by visiting its campaign page and making a contribution. Share the project with your network to help it gain more visibility.",
      },
      {
        title: "What are the benefits of crowdfunding?",
        description: `Crowdfunding allows creators to:
        Validate their ideas with real-world feedback.
        Raise funds without giving up equity.
        Build a community of supporters and advocates.`,
      },
      {
        title: "Where can I find more information?",
        description: `For more information, visit our website and check out the "Help" section. You can also join our community on Discord for support and updates.`,
      },
      {
        title: "How can I report an issue or bug?",
        description: `To report an issue or bug, please:
        Visit our support page.
        Submit a detailed report.
        Our team will review and address it promptly.`,
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
