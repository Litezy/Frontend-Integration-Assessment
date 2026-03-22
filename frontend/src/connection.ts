import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { type AppKitNetwork, liskSepolia } from "@reown/appkit/networks";

// 1. Get projectId
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

// 2. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
    liskSepolia,
];

// 3. Create a metadata object - optional
const metadata = {
    name: "Belz Token Faucet",
    description: "Claim free BELZ tokens on Lisk Sepolia testnet",
    url: "https://belz-token-faucet.vercel.app/",
    icons: ["https://belz-token-faucet.vercel.app/favicon.ico"],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    allowUnsupportedChain: false,
    metadata,
    projectId,
    defaultNetwork: liskSepolia,
    features: {
        analytics: true,
    },
    themeVariables: {
    '--w3m-font-family': "'Cabinet Grotesk', 'Satoshi', sans-serif",
    '--w3m-accent': '#7fffd4',
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px',
  },
});
