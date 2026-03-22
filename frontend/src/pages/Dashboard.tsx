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

export const Dashboard = () => {
  const { Account, truncatedAddress,handleWalletDisconnect } = useAccount();
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const { getViewValues, loading, info,fetching } = useReadToken(refetchTrigger);
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>('faucet');
  const isOwner: boolean = info?.owner?.toLowerCase() === Account.address?.toLowerCase();
  const [ready, setReady] = useState(false);
  
  const [showDisconnect, setShowDisconnect] = useState(false);

  const triggerRefetch = () => setRefetchTrigger(prev => !prev);

  const TABS: { id: TabId; label: string }[] = [
    { id: 'faucet', label: 'Faucet' },
    { id: 'info',   label: 'Token Info' },
    { id: 'mint' as TabId, label: 'Mint as Owner' },
  ];

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (ready && !Account.address) navigate('/');
  }, [Account.address, ready]);

  useEffect(() => {
    getViewValues();
  }, [getViewValues]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDisconnect) return;
    const handler = () => setShowDisconnect(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [showDisconnect]);

  if (!ready || loading || !info) return <Loading />;

  const supplyPct = (Number(info.totalSupply) / Number(info.maxSupply)) * 100;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(127,255,212,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(127,255,212,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow — top right */}
      <div
        className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.15) 0%, transparent 70%)' }}
      />

      {/* Glow — bottom left */}
      <div
        className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.10) 0%, transparent 70%)' }}
      />

      {/* ── Fixed Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md"
        style={{ background: 'rgba(0,0,0,0.8)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(127,255,212,0.4)]"
            >
              <span className="text-xs font-black text-black">B</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-primary font-bold text-xs tracking-widest uppercase leading-none">Belz Token</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_4px_#7fffd4] animate-pulse" />
                <span className="text-primary/50 text-[0.5rem] tracking-widest uppercase">Lisk Sepolia</span>
              </div>
            </div>
          </div>

          {/* Center badge */}
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_#7fffd4]" />
            <span className="text-primary text-[0.65rem] sm:text-xs tracking-[0.12em] font-medium uppercase">
              Belz Dashboard
            </span>
          </div>

          {/* Wallet + Disconnect */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowDisconnect(prev => !prev)}
              className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-3 sm:px-4 py-2 hover:bg-primary/10 hover:border-primary/35 transition-all duration-200 cursor-pointer"
            >
              {/* Avatar dot */}
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-primary text-xs font-medium tracking-wide hidden sm:block">
                {truncatedAddress}
              </span>
              {/* Chevron */}
              <svg
                className={`w-3 h-3 text-primary/50 transition-transform duration-200 ${showDisconnect ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown */}
            {showDisconnect && (
              <div
                className="absolute right-0  top-[calc(100%+8px)] w-60 border border-primary/15 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                style={{ background: 'rgba(5,10,8,0.95)', backdropFilter: 'blur(32px)' }}
              >
                {/* Address row */}
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-white/60 text-[0.55rem] tracking-widest  mb-1">Connected As</p>
                  <p className="text-white/70 text-sm font-mono">{truncatedAddress}</p>
                </div>

                {/* Network row */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-white/30 text-[0.55rem] tracking-widest uppercase">Network</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_4px_#7fffd4] animate-pulse" />
                    <span className="text-primary text-[0.6rem] font-medium">Lisk Sepolia</span>
                  </div>
                </div>

                {/* Disconnect button */}
                <button
                  onClick={handleWalletDisconnect}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-500/10 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-full border border-red-500/30 flex items-center justify-center group-hover:border-red-500/60 transition-colors">
                    <svg className="w-3 h-3 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </div>
                  <span className="text-red-400 text-xs font-bold tracking-wide group-hover:text-red-300 transition-colors">
                    Disconnect
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Content (offset for fixed header) ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-10">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Supply" fetching={fetching} value={info.totalSupply} sub="BLZ minted" icon="◈" delay={0} />
          <StatCard label="Max Supply"   value={info.maxSupply}   sub="Hard cap"   icon="⬡" delay={80} />
          <StatCard label="Faucet Drop"  value="1,000" stale={true} sub="BLZ / 24h" icon="▽" delay={160} />
        </div>

        {/* ── Supply progress ── */}
        <div
          className="relative border border-primary/15 rounded-2xl p-5 mb-6 overflow-hidden hover:border-primary/30 transition-all duration-300"
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
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
            <span className="text-white/30 text-[0.55rem] tracking-wider">{formatValue(info.totalSupply)} BLZ</span>
            <span className="text-white/30 text-[0.55rem] tracking-wider">{formatValue(info.maxSupply)} BLZ</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex gap-1 mb-6 border border-primary/15 rounded-xl p-1"
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                flex-1 text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.08em] sm:tracking-[0.12em] uppercase
                py-2.5 rounded-lg cursor-pointer border-0 transition-all duration-200
                ${tab === t.id
                  ? 'bg-primary text-black shadow-[0_0_20px_rgba(127,255,212,0.4)]'
                  : 'bg-transparent text-white/50 hover:text-white/70 hover:bg-white/5'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div
          className="relative border border-primary/15 rounded-2xl p-4 sm:p-5 overflow-hidden"
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
          <span className="absolute top-0 left-0 w-5 h-px bg-primary/50" />
          <span className="absolute top-0 left-0 w-px h-5 bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-5 h-px bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-px h-5 bg-primary/50" />

          {tab === 'faucet' && <FaucetTab info={info} onRefetch={triggerRefetch} />}
          {tab === 'info'   && <TokenInfoTab info={info} />}
          {tab === 'mint'   && (
            <MintAsOwner
              isOwner={isOwner}
              decimals={info?.decimals ?? 18}
              onRefetch={triggerRefetch}
            />
          )}
        </div>

      </div>
    </div>
  );
};