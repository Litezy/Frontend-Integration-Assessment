import { useAppKitAccount } from "@reown/appkit/react";
import { useBelzContract } from "../useContract";
import { useState } from "react";
import { ErrorMessage, formatAmountInWei, SuccessMessage } from "../../utils/utils";
import { formatUnits } from "ethers";
import { handleCustomErrors } from "../../errors/CustomError";
import { useContractUtils } from "../useContractUtils";

export type RequestResult = {
    success: true;
    amount: string
} | { success: false; reason: string };


export const useWriteToken = (onBalanceUpdate?: () => Promise<void>) => {
    const contract = useBelzContract(true);
    const [loading, setLoading] = useState(false);
    const { address } = useAppKitAccount();
    const { findEvent } = useContractUtils(contract)

    const requestToken = async (): Promise<RequestResult | null> => {
        if (!contract) return ErrorMessage("Contract not found"), null;
        if (!address) return ErrorMessage("Wallet not connected"), null;

        setLoading(true);
        try {
            const createTx = await contract.requestToken();
            const receipt = await createTx.wait();

            if (receipt.status !== 1) {
                ErrorMessage("Transaction failed on-chain");
                return { success: false, reason: "Transaction reverted" };
            }

            const event = findEvent(receipt, "TokensRequested")
            if (event) {
                const { _amount } = event.args;
                const amount = formatUnits(_amount, 18);
                SuccessMessage(`Claimed ${amount} BLZ successfully`);
                return { success: true, amount };
            }
            SuccessMessage("Tokens claimed successfully");
            return { success: true, amount: "1000" };

        } catch (error) {
            return await handleCustomErrors(error) ?? { success: false, reason: "Unknown error" };
        } finally {
            setLoading(false);
        }
    };

    const transferToken = async (_to: string, _amount: string, balance: string): Promise<RequestResult | null> => {
        if (!contract) return ErrorMessage("Contract not found"), null;
        if (!address) return ErrorMessage("Wallet not connected"), null;
        if (!_to || !_amount) return ErrorMessage("Recipient address or amount not specified"), null
        if (Number(_amount) > Number(balance)) return ErrorMessage("Insufficient balance"), null
        setLoading(true)
        try {
            const createTx = await contract.transfer(_to, formatAmountInWei(_amount));
            const receipt = await createTx.wait();

            if (receipt.status !== 1) {
                ErrorMessage("Transaction failed on-chain");
                return { success: false, reason: "Transaction reverted" };
            }
            await onBalanceUpdate?.();
            SuccessMessage("Tokens sent successfully");
            return { success: true, amount: _amount.toString() };

        } catch (error) {
            return await handleCustomErrors(error) ?? { success: false, reason: "Unknown error" };
        } finally {
            setLoading(false)
        }

    }

    return { requestToken, loading, transferToken };
};