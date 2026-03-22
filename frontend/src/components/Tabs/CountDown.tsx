
import { useState, useEffect } from 'react';
import { formatSeconds } from '../../utils/utils';

export const CountDown = ({ seconds }: { seconds: number }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
    const t = setInterval(() => setRemaining(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const pct = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 100;

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <span className=" text-xs font-bold tracking-[0.2em] text-cyan/60">
          Next Claim In
        </span>
        <span className=" font-bold text-sm text-cyan [text-shadow:0_0_16px_rgba(58,254,240,0.9)] tracking-widest">
          {remaining === 0 ? 'READY' : formatSeconds(remaining)}
        </span>
      </div>
      <div className="h-1 w-full bg-cyan/8 rounded-sm overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-cyan/50 to-cyan
                     rounded-sm transition-[width] duration-500 ease-linear
                     shadow-[0_0_8px_rgba(58,254,240,0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};