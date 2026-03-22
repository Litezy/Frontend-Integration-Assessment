// src/components/ReadTab.tsx
import { useState } from 'react';
import { type ToastData } from '../../types/types';
import { formatAmount, formatSeconds } from '../../utils/utils';

interface Props {
  onToast: (t: Omit<ToastData, 'id'>) => void;
}

const inputCls = `w-full bg-[#081422] border border-cyan/22 text-white
                  font-[DM_satoshi] text-sm outline-none rounded-sm px-3.5 py-2.5
                  placeholder:text-white/20
                  focus:border-cyan/60 focus:shadow-[0_0_14px_rgba(58,254,240,0.1)]
                  transition-all duration-200`;

interface ReadCardProps {
  title: string;
  desc: string;
  fnId: string;
  activeLoading: string | null;
  onQuery: () => void;
  result: string | null;
  children?: React.ReactNode;
}

const ReadCard = ({ title, desc, fnId, activeLoading, onQuery, result, children }: ReadCardProps) => (
  <div className="relative bg-navy-mid border border-cyan/15 rounded-sm p-5
                  hover:border-cyan/25 transition-colors duration-250">
    <span className="absolute top-0 left-0 w-3.5 h-px bg-cyan/70" />
    <span className="absolute top-0 left-0 w-px h-3.5 bg-cyan/70" />
    <span className="absolute bottom-0 right-0 w-3.5 h-px bg-cyan/70" />
    <span className="absolute bottom-0 right-0 w-px h-3.5 bg-cyan/70" />

    <p className="font-[cabinet] font-bold text-sm text-white mb-1">{title}</p>
    <p className="text-white/40 text-sm font-[DM_satoshi] mb-4 leading-relaxed">{desc}</p>

    <div className="space-y-2.5 mb-3">{children}</div>

    <button
      onClick={onQuery}
      disabled={!!activeLoading}
      className="w-full border border-cyan/50 text-cyan
                 font-[cabinet] font-bold text-[0.6rem] tracking-widest uppercase
                 px-4 py-2.5 rounded-sm cursor-pointer bg-transparent
                 transition-all duration-200
                 hover:bg-cyan/8 hover:border-cyan
                 hover:shadow-[0_0_14px_rgba(58,254,240,0.2)]
                 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <span className="flex items-center justify-center gap-2">
        {activeLoading === fnId && (
          <span className="w-3 h-3 rounded-full border border-cyan/30
                           border-t-cyan animate-spin inline-block" />
        )}
        {activeLoading === fnId ? 'Querying…' : `Call ${title}`}
      </span>
    </button>

    {result !== null && (
      <div className="mt-3 p-3 rounded-sm bg-cyan/6 border border-cyan/20">
        <span className="font-[cabinet] text-[0.45rem] font-bold tracking-[0.2em]
                         uppercase text-cyan/60 block mb-1">
          Result
        </span>
        <p className="text-cyan font-[DM_satoshi] text-sm break-all">{result}</p>
      </div>
    )}
  </div>
);

export const ReadTab = ({ onToast }: Props) => {
  const [loading, setLoading]             = useState<string | null>(null);
  const [balAddr, setBalAddr]             = useState('');
  const [balResult, setBalResult]         = useState<string | null>(null);
  const [allowFrom, setAllowFrom]         = useState('');
  const [allowSpender, setAllowSpender]   = useState('');
  const [allowResult, setAllowResult]     = useState<string | null>(null);
  const [canAddr, setCanAddr]             = useState('');
  const [canResult, setCanResult]         = useState<string | null>(null);
  const [timeAddr, setTimeAddr]           = useState('');
  const [timeResult, setTimeResult]       = useState<string | null>(null);
  const [supplyResult, setSupplyResult]   = useState<string | null>(null);
  const [maxResult, setMaxResult]         = useState<string | null>(null);

  const query = async (id: string, fn: () => Promise<string>) => {
    setLoading(id);
    try {
      return await fn();
    } catch (e: any) {
      onToast({ type: 'error', message: e?.message ?? 'Read failed.' });
      return null;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Info banner */}
      <div className="bg-cyan/4 border border-cyan/15 rounded-sm p-3
                      flex items-center gap-2">
        <span className="text-cyan text-sm shrink-0">◈</span>
        <p className="text-white/40 text-sm font-[DM_satoshi]">
          Read functions query on-chain state without gas. No wallet required.
        </p>
      </div>

      {/* totalSupply + MAX_SUPPLY side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* totalSupply */}
        <div className="relative bg-navy-mid border border-cyan/15 rounded-sm p-4
                        hover:border-cyan/25 transition-colors duration-250">
          <span className="absolute top-0 left-0 w-3 h-px bg-cyan/70" />
          <span className="absolute top-0 left-0 w-px h-3 bg-cyan/70" />
          <span className="absolute bottom-0 right-0 w-3 h-px bg-cyan/70" />
          <span className="absolute bottom-0 right-0 w-px h-3 bg-cyan/70" />
          <p className="font-[cabinet] font-bold text-sm text-white mb-1">totalSupply()</p>
          <p className="text-white/40 text-sm font-[DM_satoshi] mb-3">Current minted supply</p>
          <button onClick={async () => {
            const r = await query('totalSupply', async () => {
              // TODO: return (await contract.totalSupply()).toString();
              await new Promise(x => setTimeout(x, 600));
              return '2500000000000000000000000';
            });
            setSupplyResult(r ? `${formatAmount(r)} BLZ` : null);
          }}
            disabled={!!loading}
            className="w-full border border-cyan/40 text-cyan font-[cabinet]
                       font-bold text-[0.55rem] tracking-widest uppercase py-2 rounded-sm
                       bg-transparent cursor-pointer hover:bg-cyan/8
                       transition-colors duration-200 disabled:opacity-30">
            {loading === 'totalSupply' ? 'Querying…' : 'Query'}
          </button>
          {supplyResult && (
            <p className="font-[cabinet] font-black text-sm text-cyan
                          [text-shadow:0_0_12px_rgba(58,254,240,0.5)] mt-3">
              {supplyResult}
            </p>
          )}
        </div>

        {/* MAX_SUPPLY */}
        <div className="relative bg-navy-mid border border-cyan/15 rounded-sm p-4
                        hover:border-cyan/25 transition-colors duration-250">
          <span className="absolute top-0 left-0 w-3 h-px bg-cyan/70" />
          <span className="absolute top-0 left-0 w-px h-3 bg-cyan/70" />
          <span className="absolute bottom-0 right-0 w-3 h-px bg-cyan/70" />
          <span className="absolute bottom-0 right-0 w-px h-3 bg-cyan/70" />
          <p className="font-[cabinet] font-bold text-sm text-white mb-1">MAX_SUPPLY()</p>
          <p className="text-white/40 text-sm font-[DM_satoshi] mb-3">Hard cap</p>
          <button onClick={async () => {
            const r = await query('maxSupply', async () => {
              // TODO: return (await contract.MAX_SUPPLY()).toString();
              await new Promise(x => setTimeout(x, 600));
              return '10000000000000000000000000';
            });
            setMaxResult(r ? `${formatAmount(r)} BLZ` : null);
          }}
            disabled={!!loading}
            className="w-full border border-cyan/40 text-cyan font-[cabinet]
                       font-bold text-[0.55rem] tracking-widest uppercase py-2 rounded-sm
                       bg-transparent cursor-pointer hover:bg-cyan/8
                       transition-colors duration-200 disabled:opacity-30">
            {loading === 'maxSupply' ? 'Querying…' : 'Query'}
          </button>
          {maxResult && (
            <p className="font-[cabinet] font-black text-sm text-cyan
                          [text-shadow:0_0_12px_rgba(58,254,240,0.5)] mt-3">
              {maxResult}
            </p>
          )}
        </div>
      </div>

      {/* balanceOf */}
      <ReadCard title="balanceOf()" desc="Returns the BLZ balance of any address."
        fnId="balanceOf" activeLoading={loading} result={balResult}
        onQuery={async () => {
          const r = await query('balanceOf', async () => {
            // TODO: return (await contract.balanceOf(balAddr)).toString();
            await new Promise(x => setTimeout(x, 800));
            return '1000000000000000000000';
          });
          setBalResult(r ? `${formatAmount(r)} BLZ` : null);
        }}>
        <input className={inputCls} placeholder="Address (0x...)" value={balAddr} onChange={e => setBalAddr(e.target.value)} />
      </ReadCard>

      {/* getAllowance */}
      <ReadCard title="getAllowance()" desc="Returns remaining allowance a spender has for owner tokens."
        fnId="getAllowance" activeLoading={loading} result={allowResult}
        onQuery={async () => {
          const r = await query('getAllowance', async () => {
            // TODO: return (await contract.getAllowance(allowFrom, allowSpender)).toString();
            await new Promise(x => setTimeout(x, 800));
            return '500000000000000000000';
          });
          setAllowResult(r ? `${formatAmount(r)} BLZ` : null);
        }}>
        <input className={inputCls} placeholder="Owner address (0x...)" value={allowFrom} onChange={e => setAllowFrom(e.target.value)} />
        <input className={inputCls} placeholder="Spender address (0x...)" value={allowSpender} onChange={e => setAllowSpender(e.target.value)} />
      </ReadCard>

      {/* canClaim */}
      <ReadCard title="canClaim()" desc="Returns true if the address can call requestToken() right now."
        fnId="canClaim" activeLoading={loading} result={canResult}
        onQuery={async () => {
          const r = await query('canClaim', async () => {
            // TODO: return (await contract.canClaim(canAddr)).toString();
            await new Promise(x => setTimeout(x, 800));
            return 'true';
          });
          setCanResult(r);
        }}>
        <input className={inputCls} placeholder="Address (0x...)" value={canAddr} onChange={e => setCanAddr(e.target.value)} />
      </ReadCard>

      {/* timeUntilNextRequest */}
      <ReadCard title="timeUntilNextRequest()" desc="Seconds remaining until address can claim again. Returns 0 if ready."
        fnId="timeUntil" activeLoading={loading} result={timeResult}
        onQuery={async () => {
          const r = await query('timeUntil', async () => {
            // TODO: return (await contract.timeUntilNextRequest(timeAddr)).toString();
            await new Promise(x => setTimeout(x, 800));
            return '0';
          });
          if (r !== null) {
            const s = Number(r);
            setTimeResult(s === 0 ? '0 — Ready to claim' : `${s}s (${formatSeconds(s)} remaining)`);
          }
        }}>
        <input className={inputCls} placeholder="Address (0x...)" value={timeAddr} onChange={e => setTimeAddr(e.target.value)} />
      </ReadCard>
    </div>
  );
};