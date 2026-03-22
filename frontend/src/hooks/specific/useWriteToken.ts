import { useAppKitAccount } from "@reown/appkit/react";
import { useBelzContract } from "../useContract";
import { useState } from "react";
import { ErrorDecoder } from "ethers-decode-error";
import { ErrorMessage, SuccessMessage } from "../../utils/utils";
import { formatUnits } from "ethers";
import { useReadToken } from "./useReadToken";

type RequestResult = | { success: true; amount: string } | { success: false; reason: string };

const errorDecoder = ErrorDecoder.create();

export const useWriteToken = () => {
    const { getViewValues } = useReadToken()
    const contract = useBelzContract(true);
    const [loading, setLoading] = useState(false);
    const { address } = useAppKitAccount();

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

            const event = receipt.logs
                .map((log: any) => {
                    try { return contract.interface.parseLog(log); }
                    catch { return null; }
                })
                .find((e: any) => e?.name === "TokensRequested");

            if (event) {
                const amount = formatUnits(event.args._amount, 18);
                SuccessMessage(`Claimed ${amount} BLZ successfully`);
                return { success: true, amount };
            }
            getViewValues()
            SuccessMessage("Tokens claimed successfully");
            return { success: true, amount: "1000" };

        } catch (error) {
            const decodedError = await errorDecoder.decode(error);
            ErrorMessage(decodedError.reason! ?? "Something went wrong");
            return { success: false, reason: decodedError.reason! ?? "Unknown error" };
        } finally {
            setLoading(false);
        }
    };

    return { requestToken, loading };
};