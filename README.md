# 🚀 Crowdfunding Platform - Frontend

Welcome to the **Crowdfunding Platform** frontend, a decentralized application built on the **Aptos Blockchain**. This platform empowers project creators to raise funds transparently, while backers can contribute Aptos tokens (**APT**) directly to support innovative ideas. All operations, from project creation to fund management, are handled seamlessly through smart contracts deployed on the blockchain.

---

## 🔗 Links

- **Live Demo**: [Crowdfunding Platform](https://aptos-crowdfunding.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0x17c2ceb4f5f7069a4c48dccd7405895dd8ef5d7660b8e77d9d16176b5a6b90f6/modules/code/CrowdfundingPlatform?network=testnet)

---

## ✨ Key Features

- **Create Campaigns**: Project creators can launch campaigns with a title, description, and funding goal.
- **Back Projects**: Backers contribute Aptos tokens directly to projects they believe in.
- **Live Progress Tracking**: Campaigns display real-time progress toward their funding goals with **progress bars**.
- **Transparent Donations**: Backers can track their contributions, and creators can view incoming donations.
- **Wallet Integration**: Seamless Aptos wallet connection for easy transactions.

---

## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Aptos Wallet** (e.g., Petra Wallet) for blockchain interactions

---

## ⚙️ Setup Instructions

### 1. Move to Folder

```bash
cd crowdfunding-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add the following variables:

```bash
VITE_APP_NETWORK=testnet
VITE_MODULE_ADDRESS=0x17c2ceb4f5f7069a4c48dccd7405895dd8ef5d7660b8e77d9d16176b5a6b90f6
```

Update the **module address** if you deploy your contract to a new address.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    sys_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "17c2ceb4f5f7069a4c48dccd7405895dd8ef5d7660b8e77d9d16176b5a6b90f6"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

Connect your Aptos wallet (e.g., **Petra Wallet**) to interact with the platform. This allows you to create projects, back campaigns, and track your donations.

### 2. Create a Campaign

1. Go to the **Create Campaign** section.
2. Provide the title, description, and funding goal.
3. Submit the form to create the campaign. It will appear in the **Projects** section.

### 3. Back a Campaign

1. Browse campaigns in the **Projects** section.
2. Choose a project and enter the amount of **APT** tokens to donate.
3. Confirm the transaction via your wallet.

### 4. View Project Details

Campaign details include:

- **Title**, **description**, and **funding goal**
- **Creator address** and **progress bar** tracking funds raised
- **Backers list** (if available)

### 5. Track Donations

Go to **My Donations** to view a history of your contributions.

### 6. Manage Campaigns

Project creators can track their campaigns by navigating to the **My Campaigns** section, where they can monitor the progress and view donations received.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server.

---

## 🔍 Dependencies

- **React**: Library for building UIs.
- **TypeScript**: Type-safe JavaScript for better development experience.
- **Aptos SDK**: JavaScript SDK for blockchain interaction.
- **Ant Design / Tailwind CSS**: Modern UI design and responsive layouts.
- **Petra Wallet Adapter**: For Aptos wallet connection.

---

## 📚 Available View Functions

- **View All Campaigns**: Displays a public list of all active campaigns.
- **View Campaigns by Creator**: Shows all campaigns created by a specific wallet.
- **View Donations by Address**: Lists all donations made by a specific user.

---

## 🛡 Security and Transparency

- **Smart Contracts** handle all fund transfers directly between backers and creators.
- **No Intermediaries**: Donations go straight to the creator’s wallet upon confirmation.
- **Progress Tracking**: Backers can view the funding progress in real-time.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Errors**: Ensure that the wallet extension is installed and active.
2. **RPC Rate Limits**: Use **private RPC nodes** to avoid request limits on public RPCs.
3. **Transaction Failures**: Verify that the wallet has sufficient balance and correct permissions.

---

## 🚀 Scaling and Deployment

If deploying to **Vercel**, you might encounter **RPC request limits**. Consider these solutions:

- Use **third-party RPC providers** like **Alchemy** or **QuickNode**.
- Implement **request throttling** to reduce RPC load.
- Use **WebSockets** for real-time updates.

---

## 🎉 Conclusion

The **Crowdfunding Platform** offers a decentralized way for creators to raise funds transparently and securely. With smart contracts ensuring trust, backers can support innovative projects without intermediaries. The **user-friendly interface** allows seamless interaction with campaigns, making it easier than ever to contribute to and manage crowdfunding efforts.
