// src/types.ts
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  owner: any;
  maxSupply: string;
  requestAmount: string;
  requestInterval: number;
  balance: string;
  canClaim: boolean;
  timeUntilNextRequest: number;
}


export interface ToastData {
  id: number;
  type: 'success' | 'error' | 'pending';
  message: string;
}

export type TabId = 'faucet' | 'info' | 'write' | 'read';

export interface AccountObj {
  connected: boolean;
  address: string | null;
}