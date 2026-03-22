/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_APPKIT_PROJECT_ID: string
  readonly VITE_LISK_TESTNET_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}