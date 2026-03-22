
interface Props {
  message?: string;
}

export const Loading = ({ message = 'Loading contract data...' }: Props) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">

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

      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.08) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* Orb */}
        <div className="relative w-20 h-20">
          {/* Core */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(127,255,212,0.2), rgba(0,0,0,0.95))',
              border: '1.5px solid rgba(127,255,212,0.35)',
              boxShadow: '0 0 30px rgba(127,255,212,0.15), inset 0 0 20px rgba(127,255,212,0.05)',
            }}
          />
          {/* Inner letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-black text-primary text-base"
              style={{ textShadow: '0 0 16px rgba(127,255,212,0.9)' }}
            >
              B
            </span>
          </div>
          {/* Slow spin ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: '1px dashed rgba(127,255,212,0.2)',
              animationDuration: '6s',
            }}
          />
          {/* Ping ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: '1px solid rgba(127,255,212,0.12)',
              animationDuration: '2s',
            }}
          />
        </div>

        {/* Animated bar */}
        <div className="w-48 h-px bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: '40%',
              boxShadow: '0 0 8px rgba(127,255,212,0.6)',
              animation: 'slide 1.6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Message */}
        <div className="text-center space-y-1">
          <p className="text-primary/80 text-sm font-bold tracking-[0.2em] uppercase">
            {message}
          </p>
          <p className="text-white/25 text-[0.6rem] tracking-wider">
            Connected to Lisk Sepolia
          </p>
        </div>

      </div>

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};