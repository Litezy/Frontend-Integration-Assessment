import { useAppKit, useAppKitAccount} from "@reown/appkit/react";
import type { AccountObj } from "../types/types";
import { useEffect, useMemo } from "react";
import { useBelzContract } from "./useContract";
import { liskSepolia } from "@reown/appkit/networks";
import { appkit } from "../connection";



export const useAccount = () => {
    const { address } = useAppKitAccount();
    const { open } = useAppKit()
    const contract = useBelzContract()
    
    useEffect(() => {
        if (!address) return;

        const checkAndSwitch = async () => {
            const provider = (window as any).ethereum;
            if (!provider) return;

            const chainId = await provider.request({ method: 'eth_chainId' });
            // console.log('actual MetaMask chainId:', chainId); // e.g "0x1" for mainnet
            const liskSepoliaHex = '0x106a'; // 4202 in hex

            if (chainId !== liskSepoliaHex) {
                appkit.switchNetwork(liskSepolia);
            }
        };

        checkAndSwitch();
    }, [address]);


    const userAccount = useMemo(
        () => (address ? address : null),
        [address]
    );

    const handleWalletConnect = () => {
        open()
    }

    const Account: AccountObj = {
        connected: !!address, // similar to address ? true : false,
        address: userAccount
    }

    const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet';

    return {
        handleWalletConnect,
        truncatedAddress,
        contract,
        Account
    }
}