import { ethers } from "ethers";
import { toast } from "react-toastify";
export const formatSeconds = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const formatAmount = (raw: string) => {
  try {
    const n = Number(raw) / 1e18;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return n.toFixed(4);
  } catch {
    return raw;
  }
};


export const SuccessMessage = (message: string) => {
  return toast.success(message)
}
export const ErrorMessage = (message: string) => {
  return toast.error(message)
}


export const formatValue = (value: string | number): string => {
  const num = Number(value);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
};


export const formatAmountInWei = (amount: string, decimals = 18) => ethers.parseUnits(amount.toString(), decimals)

export const copyToClipboard = async (text: string,name:string = "text"): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    SuccessMessage(`${name} copied successfully`)
    return true;
  } catch {
    return false;
  }
};