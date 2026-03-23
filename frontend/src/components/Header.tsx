import {  CopyIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { copyToClipboard } from "../utils/utils";

interface Props {
  truncatedAddress: string | null;
  showDisconnect: boolean;
  handleWalletDisconnect: () => void;
  setShowDisconnect: Dispatch<SetStateAction<boolean>>
  address:string | null;
}

export const Header = ({ handleWalletDisconnect,address, setShowDisconnect, truncatedAddress, showDisconnect }: Props) => (
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.8)' }}
  >
    <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">

      {/* Logo */}
      <div className="p-1 rounded-full bg-primary">
        <img src="/favicon.ico" alt="logo" />
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
            <div className="px-4 py-3 flex items-start justify-between border-b border-white/5 border">
              <div className="">
                <p className="text-white/60 text-[0.55rem] tracking-widest  mb-1">Connected Account</p>
                <p className="text-white/70 text-sm font-mono">{truncatedAddress}</p>
              </div>
              <p onClick={()=> address && copyToClipboard(address,"Address")}>
                <CopyIcon className="text-sm text-primary cursor-pointer"/>
              </p>
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
);