# Crowdfunding Platform - Frontend

This is the frontend for the **Crowdfunding Platform** built on the **Aptos Blockchain**. The platform allows project creators to raise funds for their projects and backers to support projects by donating Aptos native tokens (**APT**). All interactions with the platform are securely managed through smart contracts.

## Key Features

- **Create Crowdfunding Projects**: Users can create and manage projects with funding goals and detailed descriptions.
- **Back Projects**: Backers can donate Aptos tokens to support projects they believe in.
- **View Projects**: All users can browse and view the list of active crowdfunding projects.
- **Track Donations**: Backers can view their donation history, and creators can track funds raised for their projects.
- **Project Management**: Project creators can create and manage their crowdfunding campaigns.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** extension (e.g., Petra Wallet) for blockchain interactions

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/your-repo/crowdfunding-platform.git
cd crowdfunding-platform
```

### 2. Install Dependencies

Install the necessary dependencies for the project using **npm** or **yarn**:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Configure Environment Variables

You need to configure the environment variables for the frontend to interact with the Aptos blockchain. Create a `.env` file in the project root and add the following variables:

```bash
PROJECT_NAME=CrowdfundingPlatform
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x<your_contract_address>
```

Adjust the `NODE_URL` and `FAUCET_URL` if you are using **Testnet** or **Mainnet** instead of Devnet.

### 4. Run the Development Server

Start the development server by running:

```bash
npm run dev
```

or

```bash
yarn run dev
```

The app will be available at `http://localhost:5173`.

## How to Use the Platform

### 1. Connect Wallet

Upon opening the application, you'll be prompted to connect your Aptos wallet (e.g., Petra Wallet). This allows you to interact with the blockchain and perform actions such as creating projects or backing existing ones.

### 2. Create a Project

To create a new crowdfunding project:

- Go to the **Create Project** section.
- Enter the project title, description, and the funding goal in Aptos tokens (**APT**).
- Submit the form, and the project will be created on the Aptos blockchain and appear in the list of active projects.

### 3. Back a Project

To back an existing project:

- Browse the list of available projects in the **Projects** section.
- Select a project you want to back and enter the amount of **APT** tokens you'd like to donate.
- Confirm the transaction via your connected Aptos wallet. The donation will be sent directly to the project creator's wallet.

### 4. View Project Details

Users can view detailed information about each project, including:

- Project title and description
- Funding goal and the total amount raised so far
- Project creator details
- List of backers (optional)

### 5. Track Donations

As a backer, you can navigate to **My Donations** to view the projects you've supported and the amounts you've contributed.

### 6. Manage Projects

As a project creator, you can view and manage your projects by navigating to the **My Projects** section. This section allows you to track your projects' funding progress and see details about each donation.

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm test`**: Runs unit tests.

## Dependencies

The project uses the following key dependencies:

- **React**: UI library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for type-safe development.
- **Aptos SDK**: JavaScript/TypeScript SDK to interact with the Aptos blockchain.
- **Ant Design / Tailwind CSS**: For responsive UI design and layout.
- **Petra Wallet Adapter**: To connect and interact with the Aptos wallet.

## Conclusion

This frontend enables users to seamlessly create and back crowdfunding projects on the Aptos blockchain. By using a decentralized approach, the platform ensures secure fund transfers, transparent project management, and easy tracking of donations. The user-friendly interface simplifies the crowdfunding process for both project creators and backers.
