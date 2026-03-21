import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();


const { PRIVATE_KEY, LISK_SEPOLIA_RPC} = process.env

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    lisk_sepolia: {
      url: `${LISK_SEPOLIA_RPC}`,
      accounts: [PRIVATE_KEY!]
    }
  },
  etherscan: {
    apiKey: {
      lisk_sepolia: "empty",
    },
    customChains: [
      {
        network: "lisk_sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com",
        },
      },

    ],

  },
  sourcify: {
    enabled: true,
  },
};

export default config;
