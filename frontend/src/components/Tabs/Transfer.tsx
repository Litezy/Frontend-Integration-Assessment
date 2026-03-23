// src/components/Tabs/Transfer.tsx
import { useState } from "react";
import { useAccount } from "../../hooks/useAccount";
import { formatValue } from "../../utils/utils";
import type { TokenInfo } from "../../types/types";
import type { RequestResult } from "../../hooks/specific/useWriteToken";

interface Props {
  info: TokenInfo;
  transferToken: (_to: string, _amount: string, balance: string) => Promise<RequestResult | null>;
}

const Transfer = ({ info, transferToken }: Props) => {
  const { Account } = useAccount();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTo = (value: string) => {
    setError('');
    setTo(value);
    if (value.trim().length === 42 && value.trim().toLowerCase() === Account.address?.toLowerCase()) {
      setError("Can't send to yourself");
    }
  };

  const handleAmount = (value: string) => {
    const raw = value.replace(/[^0-9]/g, '');
    setRawAmount(raw);
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(formatted);
    if (raw && Number(raw) > Number(info.balance)) {
      setError('Insufficient balance');
    } else {
      if (to.trim().length === 42 && to.trim().toLowerCase() === Account.address?.toLowerCase()) return;
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!to || !rawAmount || Number(rawAmount) <= 0 || error) return;
    setLoading(true);
    try {
      const tx = await transferToken(to, rawAmount, info.balance); // ← rawAmount not amount
      if (tx?.success) {
        setTo('');
        setAmount('');
        setRawAmount(''); // ← clear raw too
      }
    } finally {
      setLoading(false);
    }
  };

  const showPreview = to.trim().length === 42 && rawAmount && !error;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(127,255,212,0.2), rgba(0,0,0,0.95))',
              border: '1px solid rgba(127,255,212,0.35)',
              boxShadow: '0 0 16px rgba(127,255,212,0.15)',
            }}
          >
            <span className="font-black text-primary text-sm" style={{ textShadow: '0 0 10px rgba(127,255,212,0.9)' }}>
              S
            </span>
          </div>
          <p className="text-white font-bold text-xs md:text-sm tracking-wide">Send Tokens</p>
        </div>

        {/* Balance */}
        <div className="text-right">
          <span className="text-primary/50 text-[0.55rem] font-bold tracking-[0.2em] uppercase block mb-0.5">
            Balance
          </span>
          <p className="font-black text-base lg:text-xl text-primary" style={{ textShadow: '0 0 12px rgba(127,255,212,0.4)' }}>
            {formatValue(info.balance)}
            <span className="text-sm text-white/30 ml-2 font-normal">BLZ</span>
          </p>
        </div>
      </div>

      {/* Recipient */}
      <div className="space-y-2">
        <label className="text-white/60 text-[0.6rem] font-bold tracking-[0.2em] uppercase block">
          Recipient Address
        </label>
        <div
          className="relative border border-primary/15 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 focus-within:border-primary/40"
          style={{ background: 'rgba(127,255,212,0.02)' }}
        >
          <span className="absolute top-0 left-0 w-4 h-px bg-primary/50" />
          <span className="absolute top-0 left-0 w-px h-4 bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/50" />

          <div className="flex items-center gap-3 px-4 py-3.5">
            <svg className="w-4 h-4 text-primary/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              value={to}
              onChange={e => handleTo(e.target.value)}
              placeholder="0x..."
              className="flex-1 bg-transparent text-white text-base font-medium placeholder:text-white/20 outline-none tracking-wide"
            />
            {to && (
              <button
                onClick={() => { setTo(''); setError(''); }}
                className="text-white/20 hover:text-white/50 transition-colors text-sm cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white/60 text-[0.6rem] font-bold tracking-[0.2em] uppercase">
            Amount to Send
          </label>
          {/* Max button */}
          <button
            onClick={() => handleAmount(Math.floor(Number(info.balance)).toString())}
            className="text-primary/50 text-[0.6rem] font-bold tracking-widest uppercase hover:text-primary transition-colors cursor-pointer"
          >
            MAX
          </button>
        </div>
        <div
          className="relative border border-primary/15 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 focus-within:border-primary/40"
          style={{ background: 'rgba(127,255,212,0.02)' }}
        >
          <span className="absolute top-0 left-0 w-4 h-px bg-primary/50" />
          <span className="absolute top-0 left-0 w-px h-4 bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/50" />

          <div className="flex items-center gap-3 px-4 py-3.5">
            <svg className="w-4 h-4 text-primary/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <input
              type="text"
              value={amount}
              onChange={e => handleAmount(e.target.value)}
              placeholder="Enter amount…"
              className="flex-1 bg-transparent text-white text-base font-medium placeholder:text-white/20 outline-none tracking-wide"
            />
            <span className="text-primary/50 text-sm font-bold tracking-widest">BLZ</span>
          </div>
        </div>

        {/* Quick pills */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {['1000', '10000', '100000', '1000000'].map(preset => (
            <button
              key={preset}
              onClick={() => handleAmount(preset)}
              className="text-[0.6rem] font-bold tracking-wide text-primary/50 border border-primary/15 rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 cursor-pointer"
            >
              {Number(preset).toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs font-medium tracking-wide flex items-center gap-1.5">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}

      {/* Preview */}
      {showPreview && (
        <div
          className="relative border border-primary/15 rounded-xl p-4 overflow-hidden"
          style={{ background: 'rgba(127,255,212,0.02)' }}
        >
          <span className="absolute top-0 left-0 w-4 h-px bg-primary/40" />
          <span className="absolute top-0 left-0 w-px h-4 bg-primary/40" />
          <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/40" />
          <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/40" />

          <p className="text-white/30 text-[0.55rem] font-bold tracking-[0.2em] uppercase mb-3">
            Transaction Preview
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs">To</span>
              <span className="text-white/70 text-xs font-mono">{to.slice(0, 6)}...{to.slice(-4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs">Amount</span>
              <span className="text-primary text-xs font-bold">{amount} BLZ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs">Remaining</span>
              <span className="text-white/50 text-xs">
                {(Number(info.balance) - Number(rawAmount)).toLocaleString()} BLZ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !to || !rawAmount || !!error}
        className="w-full flex items-center justify-center gap-3 bg-primary text-black font-black text-[0.7rem] tracking-widest uppercase py-4 rounded-xl cursor-pointer border-0 shadow-[0_0_24px_rgba(127,255,212,0.3)] hover:bg-primary-hover hover:shadow-[0_0_36px_rgba(127,255,212,0.5)] hover:scale-[1.02] active:scale-100 active:bg-primary-active transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
            Send Tokens
          </>
        )}
      </button>

    </div>
  );
};

export default Transfer;