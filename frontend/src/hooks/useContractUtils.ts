import { Contract, TransactionReceipt } from "ethers";

export const useContractUtils = (contract: Contract | null) => {

  const findEvent = (receipt: TransactionReceipt, eventName: string) => {
    if (!contract) return null;

    return receipt.logs
      .map((log) => {
        try { return contract.interface.parseLog(log); }
        catch { return null; }
      })
      .find((e) => e?.name === eventName) ?? null;
  };

  const getEventArgs = <T>(receipt: TransactionReceipt, eventName: string): T | null => {
    const event = findEvent(receipt, eventName);
    if (!event) return null;
    return event.args as T;
  };

  

  return { findEvent, getEventArgs };
};