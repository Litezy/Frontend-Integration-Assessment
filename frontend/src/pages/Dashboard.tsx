// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { type TabId } from '../types/types';
import { StatCard } from '../components/StatCard';
import { FaucetTab } from '../components/Tabs/FaucetTab';
import { TokenInfoTab } from '../components/Tabs/TokenInfoTab';
import { formatValue } from '../utils/utils';
import { useAccount } from '../hooks/useAccount';
import { useNavigate } from 'react-router-dom';
import { useReadToken } from '../hooks/specific/useReadToken';
import { Loading } from '../components/Loading';
import MintAsOwner from '../components/Tabs/MintAsOwner';

// const TABS: { id: TabId; label: string }[] = [
//   { id: 'faucet', label: 'Faucet' },
//   { id: 'info', label: 'Token Info' },
//   { id: 'mint', label: 'Mint as Owner' },
// ];

export const Dashboard = () => {
  const { Account, handleWalletConnect, truncatedAddress } = useAccount()
  const { getViewValues, loading, info } = useReadToken()
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabId>('faucet');
  const isOwner: boolean = info?.owner?.toLowerCase() === Account.address?.toLowerCase();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Give AppKit time to rehydrate the session
    const t = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (ready && !Account.address) {
      navigate('/');
    }
  }, [Account.address, ready]);

  useEffect(() => {
    getViewValues();
  }, [getViewValues]);

  if (!ready || loading || !info) return <Loading />;

  const TABS: { id: TabId; label: string }[] = [
  { id: 'faucet', label: 'Faucet' },
  { id: 'info',   label: 'Token Info' },
  ...(isOwner ? [{ id: 'mint' as TabId, label: 'Mint as Owner' }] : []),
];

  const supplyPct = (Number(info.totalSupply) / Number(info.maxSupply)) * 100;
  // console.log(supplyPct)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden ">

      {/* Grid overlay — same density as Landing */}
      <div
        className="absolute inset-0 pointer-events-none"
      // style={{
      //   backgroundImage: `
      //     linear-gradient(rgba(127,255,212,0.06) 1px, transparent 1px),
      //     linear-gradient(90deg, rgba(127,255,212,0.06) 1px, transparent 1px)
      //   `,
      //   backgroundSize: '48px 48px',
      // }}
      />

      {/* Glow — top right (mirrored from Landing's top left) */}
      <div
        className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.15) 0%, transparent 70%)' }}
      />

      {/* Glow — bottom left */}
      <div
        className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.10) 0%, transparent 70%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

        {/* Page label — mirrors Landing's badge */}
        <div
          className={`flex justify-center mb-8 gap-5 transition-all duration-700 ${Account.address ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        >
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-5 py-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_#7fffd4]" />
            <span className="text-primary text-sm tracking-[0.12em] font-medium">BELZ TOKEN DASHBOARD</span>
          </div>

          <button
            onClick={handleWalletConnect}
            className="flex items-center cursor-pointer gap-2 bg-primary/5 border border-primary/20 rounded-full px-5 py-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_#7fffd4]" />
            <span className="text-primary text-sm tracking-[0.12em] font-medium">{truncatedAddress}</span>
          </button>
        </div>



        {/* ── Stats row ── */}
        <div
          className={`grid grid-cols-3 gap-3 mb-6 transition-all duration-700 delay-100 ${Account.address ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <StatCard label="Total Supply" value={info.totalSupply} sub="BLZ minted" icon="◈" delay={0} />
          <StatCard label="Max Supply" value={info.maxSupply} sub="Hard cap" icon="⬡" delay={80} />
          <StatCard label="Faucet Drop" value="1,000" stale={true} sub="BLZ / 24h" icon="▽" delay={160} />
        </div>

        {/* ── Supply progress ── */}
        <div
          className={`relative border border-primary/15 rounded-2xl p-5 mb-6 overflow-hidden transition-all duration-700 delay-200 hover:border-primary/30 ${Account.address ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-5 h-px bg-primary/70" />
          <span className="absolute top-0 left-0 w-px h-5 bg-primary/70" />
          <span className="absolute bottom-0 right-0 w-5 h-px bg-primary/70" />
          <span className="absolute bottom-0 right-0 w-px h-5 bg-primary/70" />

          <div className="flex justify-between items-center mb-3">
            <span className="text-white/50 text-[0.6rem] font-bold tracking-[0.2em] uppercase">
              Supply Progress
            </span>
            <span className="text-primary text-sm font-bold tracking-wide">
              {supplyPct.toFixed(2)}% minted
            </span>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{
                width: `${Math.max(supplyPct, 0.5)}%`,
                background: 'linear-gradient(90deg, rgba(127,255,212,0.5), #7fffd4)',
                boxShadow: '0 0 12px rgba(127,255,212,0.6)',
              }}
            />
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-white/30 text-[0.55rem] tracking-wider">{formatValue(info.totalSupply)}BLZ</span>
            <span className="text-white/30 text-[0.55rem] tracking-wider">{formatValue(info.maxSupply)} BLZ</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className={`flex gap-1 mb-6 border border-primary/15 rounded-xl p-1 transition-all duration-700 delay-300 ${Account.address ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                flex-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase
                py-2.5 rounded-lg cursor-pointer border-0 transition-all duration-200
                ${tab === t.id
                  ? 'bg-primary text-black shadow-[0_0_20px_rgba(127,255,212,0.4)]'
                  : 'bg-transparent text-white/60 hover:text-white/70 hover:bg-white/5'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div
          className={`relative border border-primary/15 rounded-2xl p-5 overflow-hidden transition-all duration-700 delay-400m ${Account.address ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-5 h-px bg-primary/50" />
          <span className="absolute top-0 left-0 w-px h-5 bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-5 h-px bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-px h-5 bg-primary/50" />

          {tab === 'faucet' && <FaucetTab info={info} />}
          {tab === 'info' && <TokenInfoTab info={info} />}
          {tab === 'mint' &&
            <MintAsOwner
              isOwner={isOwner}
              decimals={info?.decimals ?? 18}
              onRefetch={getViewValues}
            />
          }
        </div>

      </div>
    </div>
  );
};