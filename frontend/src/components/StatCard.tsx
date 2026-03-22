import { formatValue } from "../utils/utils";

// src/components/StatCard.tsx
interface Props {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  stale?: boolean,
  delay?: number;
}

export const StatCard = ({ label, value, sub, icon, delay = 0 ,stale =false}: Props) => (
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

    {/* Icon */}
    <div className="flex items-center justify-between mb-4">
      <span className="text-white/20 text-base group-hover:text-primary/40 transition-colors duration-300">
        {icon}
      </span>
      <span className="text-primary/40 text-[0.55rem] font-bold tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>

    {/* Value */}
    <p
      className="font-black text-2xl text-primary leading-none mb-1.5"
      style={{ textShadow: '0 0 20px rgba(127,255,212,0.4)' }}
    >
      {!stale ? formatValue(value) : value}
    </p>

    {/* Sub */}
    {sub && (
      <p className="text-white/35 text-[0.65rem] tracking-wide">{sub}</p>
    )}
  </div>
);