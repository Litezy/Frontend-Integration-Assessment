import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';

export const Landing: React.FC = () => {
  const { Account,handleWalletConnect ,truncatedAddress} = useAccount()
  const navigate = useNavigate()
 
   useEffect(()=>{
    if(Account.address){
      navigate('/dashboard')
    }
   },[Account.address])
   
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

      {/* Glow — top left */}
      <div
        className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.12) 0%, transparent 70%)' }}
      />

      {/* Glow — bottom right */}
      <div
        className="absolute -bottom-48 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.07) 0%, transparent 70%)' }}
      />


      {/* ── Main ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-20">

        {/* Badge */}
        <div className={`flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-5 py-1.5 mb-10 transition-all duration-700 `}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7fffd4" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="text-primary text-sm tracking-[0.12em] font-medium">ERC-20 TESTNET FAUCET</span>
        </div>

        {/* Headline */}
        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black text-white text-center leading-[1.1] max-w-3xl mb-6 transition-all duration-700 delay-100 translate-y-4`}>
          Welcome to{' '}
          <span className="text-primary italic" style={{ textShadow: '0 0 32px rgba(127,255,212,0.45)' }}>
            Belz Token
          </span>{' '}
          Faucet
        </h1>

        {/* Description */}
        <p className={`text-white/50 text-base md:text-lg leading-relaxed text-center max-w-xl mb-14 transition-all duration-700 delay-200`}>
          Claim free <strong className="text-white/80 font-semibold">BELZ</strong> tokens for
          testing and development on the Sepolia testnet. No gas fees, no complications —
          just connect your wallet and start building.
        </p>

        {/* Stats row */}
        <div className={`flex divide-x divide-primary/10 border border-primary/10 rounded-2xl overflow-hidden mb-14 transition-all duration-700 delay-300`}>
          {[
            { label: 'Per Claim', value: '1,000 BELZ' },
            { label: 'Cooldown',  value: '24 Hours' },
            { label: 'Network',   value: 'Lisk-Sepolia'  },
          ].map((stat) => (
            <div key={stat.label} className="px-8 py-5 bg-white/2 text-center">
              <p className="text-primary text-lg font-bold tracking-wide">{stat.value}</p>
              <p className="text-white/30 text-[11px] mt-1 tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Connect Wallet CTA */}
        <button
          onClick={handleWalletConnect}
          className={`
            flex items-center gap-3 cursor-pointer rounded-xl px-9 py-4 text-sm font-bold tracking-wide
            bg-primary text-black
            hover:bg-primary-hover active:bg-primary-active
            shadow-[0_0_30px_rgba(127,255,212,0.3)] hover:shadow-[0_0_44px_rgba(127,255,212,0.5)]
            hover:scale-[1.03] active:scale-100
            transition-all duration-200
          `}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
          </svg>
           {truncatedAddress}
        </button>

        {/* Footnote */}
        <p className={`text-white/20 text-sm mt-5 tracking-wider transition-all duration-700 delay-500  `}>
          MetaMask · Coinbase Wallet · WalletConnect supported
        </p>

      </main>
    </div>
  );
};