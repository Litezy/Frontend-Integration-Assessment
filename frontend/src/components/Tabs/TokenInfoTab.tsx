
import { type TokenInfo } from '../../types/types';
import {  formatValue } from '../../utils/utils';

export const TokenInfoTab = ({ info }: { info: TokenInfo }) => {
  

  const rows = [
    { label: 'Token Name',      value: info.name },
    { label: 'Symbol',          value: info.symbol },
    { label: 'Decimals',        value: String(info.decimals) },
    { label: 'Total Supply',    value: `${formatValue(info.totalSupply)} BLZ` },
    { label: 'Max Supply',      value: `${formatValue(info.maxSupply)} BLZ` },
    { label: 'Faucet Amount',   value: '1,000 BLZ / claim' },
    { label: 'Faucet Interval', value: '24 Hours' },
    { label: 'Network',         value: 'Lisk Sepolia' },
    { label: 'Chain ID',        value: '4202' },
  ];

  return (
    <div className="space-y-4">

      

      {/* ── Info table ── */}
      <div
        className="relative border border-primary/15 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(127,255,212,0.02)' }}
      >
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-5 h-px bg-primary/50" />
        <span className="absolute top-0 left-0 w-px h-5 bg-primary/50" />
        <span className="absolute bottom-0 right-0 w-5 h-px bg-primary/50" />
        <span className="absolute bottom-0 right-0 w-px h-5 bg-primary/50" />

        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`
              flex items-center justify-between px-5 py-3.5
              border-b border-primary/6 last:border-b-0
              hover:bg-primary/3 transition-colors duration-200
              ${i % 2 === 1 ? 'bg-primary/2' : ''}
            `}
          >
            <span className="text-white/60 text-sm font-bold tracking-[0.2em] uppercase">
              {row.label}
            </span>
            <span className="text-white/80 text-sm font-medium">{row.value}</span>
          </div>
        ))}
      </div>

    </div>
  );
};