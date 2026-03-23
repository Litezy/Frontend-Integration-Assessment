import { useAppKitAccount } from "@reown/appkit/react";
import { useBelzContract } from "../useContract";
import { useCallback, useRef, useState } from "react";
import { formatUnits } from "ethers";
import { ErrorMessage } from "../../utils/utils";
import type { TokenInfo } from "../../types/types";
import { handleCustomErrors } from "../../errors/CustomError";

export const useReadToken = (trigger: boolean = false) => {
  const contract = useBelzContract();
  const { address } = useAppKitAccount();
  const [loading, setLoading] = useState(false);       // full screen loader
  const [fetching, setFetching] = useState(false);     // silent background refetch
  const [info, setInfo] = useState<TokenInfo | null>(null);
  const isFirstLoad = useRef(true);

  const getViewValues = useCallback(async () => {
    if (!contract) return null;

    // First load → show full screen loader
    // Subsequent calls (after write) → silent, no loader
    if (isFirstLoad.current) {
      setLoading(true);
    } else {
      setFetching(true);
    }

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

      setInfo({
        name, symbol,
        decimals: Number(decimals),
        totalSupply: formatUnits(totalSupply, decimals),
        owner,
        maxSupply: formatUnits(maxSupply, decimals),
        requestAmount: formatUnits(requestAmount, decimals),
        requestInterval: Number(requestInterval),
        balance, canClaim, timeUntilNextRequest,
      });

    } catch (err) {
      console.error('Failed to read contract:', err);
      ErrorMessage("Failed to read contract");
    } finally {
      setLoading(false);
      setFetching(false);
      isFirstLoad.current = false;
    }
  }, [contract, address, trigger]);



  const getUserBalance = async () => {
    if (!contract) return;
    if (!address) return ErrorMessage("Address missing")
    if (!info) return;
    try {
      const balance = await contract.balanceOf(address)
      const bal = formatUnits(balance, 18);
      setInfo(prev => prev ? { ...prev, balance: bal } : prev);
    } catch (error) {
      await handleCustomErrors(error)
    }
  }



  return { getViewValues, getUserBalance, loading, fetching, info };
};