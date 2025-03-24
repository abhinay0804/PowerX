

## ⚡️ **PowerX: Revolutionizing Peer-to-Peer Energy Trading with Blockchain**

PowerX is a cutting-edge blockchain-powered platform that facilitates secure, transparent, and efficient peer-to-peer (P2P) energy trading. By integrating smart contracts, decentralized ledgers, and tokenized carbon credits, PowerX empowers users to seamlessly trade renewable energy and earn carbon credits as rewards. 

This platform not only democratizes energy markets but also incentivizes sustainable practices, contributing to a cleaner and greener future.

---

## 🚀 **Key Features**
- **P2P Energy Trading:** Enables direct energy trading between producers and consumers.
- **Blockchain Security:** Ensures immutability, transparency, and traceability of transactions.
- **Carbon Credit Rewards:** Incentivizes renewable energy trading with tokenized carbon credits.
- **Wallet Integration:** Seamlessly connects with MetaMask for secure transactions.
- **Real-Time Market Insights:** Provides real-time updates on energy pricing and trading.

---

## 📚 **Tech Stack**
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Blockchain:** Ethereum, Solidity, Hardhat
- **Database:** Supabase
- **Storage:** Pinata IPFS for metadata storage
- **Wallet Integration:** MetaMask

---


## ⚙️ **Prerequisites**
- Node.js and npm
- MetaMask wallet
- Hardhat installed globally (`npm install -g hardhat`)

---

## 📥 **Installation and Setup**

### ➤ **Step 1: Clone the Repository**
```bash
git clone https://github.com/abhinay0804/PowerX.git
```
Navigate to the project directory:
```bash
cd PowerX
```

---

## 📂 **Step 2: Setup Frontend and Backend**

### ➤ **Frontend Setup**
1. Navigate to the frontend directory:
```bash
cd front3/power-token-exchange-main
```
2. Install dependencies:
```bash
npm install
```
3. Start the frontend server:
```bash
npm run dev
```
- The frontend will be available at `http://localhost:3000`.

---

### ➤ **Backend Setup**
1. Open a new terminal and go to the backend directory:
```bash
cd ../../backend
```
2. Install dependencies:
```bash
npm install
```
3. Run the backend server:
```bash
npm start
```
- Backend will be running at `http://localhost:5000`.

---

## 🔗 **Step 3: Configure Environment Variables**

### ➤ **Frontend `.env` File**
Create a `.env` file in `front3/power-token-exchange-main` with the following:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_PINATA_API_KEY=<your-pinata-api-key>
VITE_PINATA_SECRET_API_KEY=<your-pinata-secret-key>
```

### ➤ **Backend `.env` File**
Create a `.env` file in `backend` with:
```
PORT=5000
DATABASE_URL=<your-supabase-database-url>
```

---

## 📝 **Step 4: Deploy Smart Contracts**

1. Navigate to the smart contracts folder:
```bash
cd ../smart-contracts
```
2. Install dependencies:
```bash
npm install
```
3. Compile smart contracts:
```bash
npx hardhat compile
```
4. Deploy smart contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🧩 **Step 5: Connect Wallet and Test Application**

1. Open your browser and go to `http://localhost:3000`.
2. Connect your MetaMask wallet.
3. Test trading energy and mint carbon credits.
4. Verify that blockchain transactions are recorded properly.

---

## 🎯 **Step 6: Finalizing and Running Tests**

1. Run tests to ensure everything is working:
```bash
npx hardhat test
```

2. Enjoy using **PowerX**! 🎉

---

## 💡 **Troubleshooting Tips**
- Ensure you have **Node.js** and **npm** installed.
- Run `npx hardhat node` to start a local blockchain if needed.
- Check MetaMask network settings to connect with the correct network.
