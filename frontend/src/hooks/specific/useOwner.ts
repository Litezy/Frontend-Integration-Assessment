import { useBelzContract } from "../useContract";
import { useState } from "react";
import { ErrorMessage, formatAmountInWei, SuccessMessage } from "../../utils/utils";
import { ErrorDecoder } from "ethers-decode-error";
import { formatUnits } from "ethers";
import type { RequestResult } from "./useWriteToken";
import { useAppKitAccount } from "@reown/appkit/react";
import { useContractUtils } from "../useContractUtils";


export const useOwnerFns = () => {
  const contract = useBelzContract(true);
  const { findEvent } = useContractUtils(contract)
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
        formatAmountInWei(amount)
      );
      const receipt = await createTx.wait();

      if (receipt.status !== 1) {
        ErrorMessage("Transaction failed on-chain");
        return { success: false, reason: "Transaction reverted" };
      }

      const event = findEvent(receipt, "Mint")
      if (event) {
        const { _amount } = event.args
        const mintedAmount = formatUnits(_amount, decimals);
        SuccessMessage(`${mintedAmount} BLZ tokens minted successfully`);
        return { success: true, amount: mintedAmount };
      }
      SuccessMessage(`${amount} BLZ tokens minted successfully`);
      return { success: true, amount: amount };

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