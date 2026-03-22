
interface Props {
  connected: boolean;
  address: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header = ({ connected, address, onConnect, onDisconnect }: Props) => (
  <header className="relative z-10 flex items-center justify-between px-10 py-5 border-b border-white/5">

    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(127,255,212,0.4)]">
        <span className="text-sm font-black text-black">B</span>
      </div>
      <div>
        <p className="text-primary font-bold text-sm tracking-widest uppercase leading-none">
          Belz Token
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_#7fffd4]" />
          <span className="text-primary/60 text-[0.55rem] font-bold tracking-[0.2em] uppercase">
            Sepolia Testnet
          </span>
        </div>
      </div>
    </div>

    {/* Wallet */}
    {connected ? (
      <div className="flex items-center gap-3">
        {/* Truncated address */}
        <span className="hidden sm:block text-sm text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full font-medium tracking-wide">
          {address}
        </span>
        <button
          onClick={onDisconnect}
          className="border border-primary/40 text-primary text-[0.65rem] font-bold tracking-widest uppercase px-4 py-2 rounded-full bg-transparent hover:bg-primary/10 hover:border-primary transition-all duration-200 cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    ) : (
      <button
        onClick={onConnect}
        className="bg-primary text-black text-[0.7rem] font-black tracking-widest uppercase px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(127,255,212,0.3)] hover:bg-primary-hover hover:shadow-[0_0_32px_rgba(127,255,212,0.5)] hover:scale-[1.03] active:scale-100 active:bg-primary-active transition-all duration-200 cursor-pointer"
      >
        Connect Wallet
      </button>
    )}
  </header>
);