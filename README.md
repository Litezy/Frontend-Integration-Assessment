# Belz Token Faucet

A decentralized ERC-20 testnet faucet built on **Lisk Sepolia**, allowing developers to claim free **BELZ** tokens for testing and development purposes.

---

## Overview

Belz Token (BLZ) is a capped ERC-20 token with a built-in faucet mechanism. Users connect their wallet and claim tokens once every 24 hours. The contract owner can mint additional tokens up to the maximum supply cap.

---

## Smart Contract

| Property | Value |
|---|---|
| Network | Lisk Sepolia (Chain ID: 4202) |
| Standard | ERC-20 |
| Max Supply | 10,000,000 BLZ |
| Faucet Amount | 1,000 BLZ per claim |
| Cooldown | 24 hours |

### Key Functions

| Function | Access | Description |
|---|---|---|
| `requestToken()` | Public | Claim 1,000 BLZ (once per 24h) |
| `mint(address, amount)` | Owner | Mint tokens to any address |
| `burn(amount)` | Public | Burn your own tokens |
| `transfer(to, amount)` | Public | Transfer tokens |
| `canRequest(address)` | View | Check if address can claim |
| `timeUntilNextRequest(address)` | View | Seconds until next claim |

### Events

- `TokensRequested(user, amount, time)` — emitted on every faucet claim
- `Mint(to, amount)` — emitted when owner mints
- `Transfer(from, to, value)` — standard ERC-20 transfer

---

## Frontend

Built with **React + TypeScript**, **Tailwind CSS v4**, **ethers.js v6**, and **Reown AppKit** for wallet connectivity.

### Stack

- **Framework** — React 19 + Vite
- **Styling** — Tailwind CSS v4, Cabinet Grotesk font
- **Web3** — ethers.js v6, Reown AppKit (WalletConnect)
- **Wallet Support** — MetaMask, Coinbase Wallet, WalletConnect

### Pages

- **Landing** — Connect wallet to enter. Displays faucet stats and supported wallets.
- **Dashboard** — Live contract data, supply progress, tabbed interface for Faucet, Token Info, and Owner Mint.

### Features

- Auto network switch to Lisk Sepolia on connect
- Owner-only Mint tab (detected via contract `owner()`)
- Silent background refetch after write transactions
- 24h cooldown countdown display

---

## Getting Started

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add VITE_CONTRACT_ADDRESS,VITE_LISK_TESTNET_RPC_URL and VITE_APPKIT_PROJECT_ID

# Run dev server
npm run dev
```

### Environment Variables

```env
VITE_CONTRACT_ADDRESS=0x...
VITE_APPKIT_PROJECT_ID=your_project_id
VITE_LISK_TESTNET_RPC_URL
```

---

## RPC

Uses Lisk Sepolia public RPC — `https://rpc.sepolia-api.lisk.com`

> This is a testnet project. Tokens hold no real value.


> Built with ❤️ by Litezy
