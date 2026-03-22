import { useBelzContract } from "../useContract";
import { useState } from "react";
import { ErrorMessage, SuccessMessage } from "../../utils/utils";
import { ErrorDecoder } from "ethers-decode-error";
import { ethers, formatUnits } from "ethers";
import type { RequestResult } from "./useWriteToken";
import { useAppKitAccount } from "@reown/appkit/react";




export const useOwnerFns = () => {
  const contract = useBelzContract(true);
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);
  const errorDecoder = ErrorDecoder.create();

  const OwnerMintToken = async (recipient: string, amount: string, decimals = 18): Promise<RequestResult | null> => {
    if (!contract) return ErrorMessage("Contract not found"), null;
    if (!address) return ErrorMessage("Wallet not connected"), null;

    setLoading(true);
    try {
      const createTx = await contract.mint(
        recipient,
        ethers.parseUnits(amount.toString(), decimals)
      );
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
        .find((e: any) => e?.name === "Mint");

      const mintedAmount = event ? formatUnits(event.args._amount, decimals) : amount;
      SuccessMessage(`${mintedAmount} BLZ tokens minted successfully`); 
      return { success: true, amount: mintedAmount };

    } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      ErrorMessage(decodedError.reason ?? "Something went wrong");
      return { success: false, reason: decodedError.reason ?? "Unknown error" };
    } finally {
      setLoading(false);
    }
  };

  return { OwnerMintToken, loading };
};