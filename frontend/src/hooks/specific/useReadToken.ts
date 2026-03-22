import { useAppKitAccount } from "@reown/appkit/react";
import { useBelzContract } from "../useContract";
import { useCallback, useState } from "react";
import { formatUnits } from "ethers";
import { ErrorMessage } from "../../utils/utils";
import type { TokenInfo } from "../../types/types";

export const useReadToken = () => {
  const contract = useBelzContract();
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<TokenInfo | null>(null);

  const getViewValues = useCallback(async () => {
    if (!contract) return null;

    setLoading(true);
    try {
      const [name, symbol, decimals, totalSupply, owner, maxSupply, requestAmount, requestInterval] =
        await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.totalSupply(),
          contract.owner(),
          contract.MAX_SUPPLY(),
          contract.REQUEST_AMOUNT(),
          contract.REQUEST_INTERVAL(),
        ]);

      let balance = '0';
      let canClaim = false;
      let timeUntilNextRequest = 0;

      if (address) {
        const [bal, can, time] = await Promise.all([
          contract.balanceOf(address),
          contract.canRequest(address),
          contract.timeUntilNextRequest(address),
        ]);
        balance = formatUnits(bal, decimals);
        canClaim = can;
        timeUntilNextRequest = Number(time);
      }

      const result = {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: formatUnits(totalSupply, decimals),
        owner,
        maxSupply: formatUnits(maxSupply, decimals),
        requestAmount: formatUnits(requestAmount, decimals),
        requestInterval: Number(requestInterval),
        balance,
        canClaim,
        timeUntilNextRequest,
      };
      // console.log(result)
      setInfo(result)
    } catch (err) {
      console.error('Failed to read contract:', err);
      ErrorMessage("Failed to read contract")
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  return { getViewValues, loading,info };
};