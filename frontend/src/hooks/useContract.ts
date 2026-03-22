import { useMemo } from "react";
import { Contract, getAddress } from "ethers";
import useRunners from "./useRunner";
import { BELZ_ABI } from "../ABI/belz_token"

export const useBelzContract = (withSigner = false) => {
  const { readOnlyProvider, signer } = useRunners();
  const CA = import.meta.env.VITE_CONTRACT_ADDRESS;

  return useMemo(() => {
    if (!CA) {
      console.warn('Contract address not set');
      return null;
    }
    if (withSigner && !signer) return null;

    return new Contract(
      getAddress(CA),
      BELZ_ABI,
      withSigner ? signer : readOnlyProvider
    );
  }, [readOnlyProvider, signer, withSigner, CA]);
};