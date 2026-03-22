import { formatValue } from "../utils/utils";

interface Props {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  stale?: boolean;
  fetching?: boolean;
  delay?: number;
}

export const StatCard = ({ label, value, sub, icon, delay = 0, stale = false, fetching = false }: Props) => (
  <div
    className="relative border border-primary/15 rounded-2xl p-5 overflow-hidden
               hover:border-primary/30 transition-all duration-300 group"
    style={{
      background: 'rgba(127,255,212,0.03)',
      animationDelay: `${delay}ms`,
    }}
  >
    {/* Corner accents */}
    <span className="absolute top-0 left-0 w-4 h-px bg-primary/60" />
    <span className="absolute top-0 left-0 w-px h-4 bg-primary/60" />
    <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/60" />
    <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/60" />

    {/* Top shimmer bar — only while fetching */}
    {fetching && (
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div
          className="h-full bg-primary/70 rounded-full"
          style={{
            width: '40%',
            animation: 'slide 1.4s ease-in-out infinite',
            boxShadow: '0 0 8px rgba(127,255,212,0.9)',
          }}
        />
      </div>
    )}

    {/* Icon + label row */}
    <div className="flex items-center justify-between mb-4">
      <span className="text-white/20 text-base group-hover:text-primary/40 transition-colors duration-300">
        {icon}
      </span>
      <span className="text-primary/60 text-[0.55rem] font-bold tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>

    {/* Value area — spinner overlays the figure while fetching */}
    <div className="relative mb-1.5 h-8 flex items-center">
      {/* Actual value — hidden behind overlay when fetching */}
      <p
        className={`font-black text-2xl text-primary leading-none transition-all duration-500 ${fetching ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}
        style={{ textShadow: '0 0 20px rgba(127,255,212,0.4)' }}
      >
        {!stale ? formatValue(value) : value}
      </p>

      {/* Spinner overlay — shows while fetching */}
      {fetching && (
        <div className="absolute inset-0 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary/60 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="text-primary/40 text-xs font-medium tracking-widest">
            syncing
          </span>
        </div>
      )}
    </div>

    {/* Sub */}
    {sub && (
      <p className={`text-[0.65rem] tracking-wide transition-colors duration-300 ${fetching ? 'text-white/25' : 'text-white/60'}`}>
        {sub}
      </p>
    )}

    <style>{`
      @keyframes slide {
        0%   { transform: translateX(-100%); }
        50%  { transform: translateX(350%); }
        100% { transform: translateX(-100%); }
      }
      @keyframes bar {
        0%, 100% { height: 8px;  opacity: 0.3; }
        50%       { height: 24px; opacity: 1;   }
      }
    `}</style>
  </div>
);