// src/components/TokenInfoTab.tsx
import { type TokenInfo } from '../../types/types';
import { formatAmount } from '../../utils/utils';

export const TokenInfoTab = ({ info }: { info: TokenInfo }) => {
  const pct = info.maxSupply !== '0'
    ? Math.min(100, (Number(info.totalSupply) / Number(info.maxSupply)) * 100)
    : 0;

  const rows = [
    { label: 'Token Name',       value: info.name },
    { label: 'Symbol',           value: info.symbol },
    { label: 'Decimals',         value: String(info.decimals) },
    { label: 'Total Supply',     value: `${formatAmount(info.totalSupply)} BLZ` },
    { label: 'Max Supply',       value: `${formatAmount(info.maxSupply)} BLZ` },
    { label: 'Faucet Amount',    value: '1,000 BLZ / claim' },
    { label: 'Faucet Interval',  value: '24 Hours' },
    { label: 'Network',          value: 'Lisk Sepolia' },
    { label: 'Chain ID',         value: '4202' },
  ];

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Supply meter */}
      <div className="relative bg-navy-mid border border-cyan/15 rounded-sm p-5
                      hover:border-cyan/30 transition-colors duration-250">
        <span className="absolute top-0 left-0 w-3.5 h-px bg-cyan/70" />
        <span className="absolute top-0 left-0 w-px h-3.5 bg-cyan/70" />
        <span className="absolute bottom-0 right-0 w-3.5 h-px bg-cyan/70" />
        <span className="absolute bottom-0 right-0 w-px h-3.5 bg-cyan/70" />

        <div className="flex items-center justify-between mb-3">
          <span className="font-[cabinet] text-[0.5rem] font-bold tracking-[0.2em]
                           uppercase text-cyan/60">
            Supply Utilization
          </span>
          <span className="font-[cabinet] font-bold text-sm text-cyan">
            {pct.toFixed(2)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-cyan/8 rounded-sm overflow-hidden mb-2">
          <div
            className="h-full bg-linear-to-r from-cyan/50 to-cyan rounded-sm
                       shadow-[0_0_10px_rgba(58,254,240,0.5)] transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-white/35 text-sm font-[DM_satoshi]">
          <span>{formatAmount(info.totalSupply)} minted</span>
          <span>{formatAmount(info.maxSupply)} max</span>
        </div>
      </div>

      {/* Info table */}
      <div className="bg-navy-mid border border-cyan/15 rounded-sm overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-3
                        border-b border-cyan/6 last:border-b-0
                        ${i % 2 === 1 ? 'bg-cyan/2' : ''}`}
          >
            <span className="font-[cabinet] text-[0.5rem] font-bold tracking-[0.2em]
                             uppercase text-cyan/60">
              {row.label}
            </span>
            <span className="text-white text-sm font-[DM_satoshi]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};