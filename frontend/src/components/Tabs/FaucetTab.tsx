
import { type TokenInfo } from '../../types/types';
import { CountDown } from './CountDown';
import { formatValue } from '../../utils/utils';
import { useAccount } from '../../hooks/useAccount';
import { useWriteToken } from '../../hooks/specific/useWriteToken';

interface Props {
  info: TokenInfo;
}

export const FaucetTab = ({ info }: Props) => {
  const { Account, truncatedAddress } = useAccount();
  const { loading, requestToken } = useWriteToken();
  const connected = Account.connected;;


  return (
    <div className="space-y-4">

      {/* ── Hero claim card ── */}
      <div
        className="relative border border-primary/15 rounded-2xl p-8 text-center overflow-hidden hover:border-primary/30 transition-all duration-300"
        style={{ background: 'rgba(127,255,212,0.03)' }}
      >
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-5 h-px bg-primary/60" />
        <span className="absolute top-0 left-0 w-px h-5 bg-primary/60" />
        <span className="absolute bottom-0 right-0 w-5 h-px bg-primary/60" />
        <span className="absolute bottom-0 right-0 w-px h-5 bg-primary/60" />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(127,255,212,0.07) 0%, transparent 70%)' }}
        />

        {/* Token orb */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 30%, rgba(127,255,212,0.18), rgba(0,0,0,0.95))',
                border: '1.5px solid rgba(127,255,212,0.35)',
                boxShadow: '0 0 40px rgba(127,255,212,0.15), 0 0 80px rgba(127,255,212,0.06), inset 0 0 24px rgba(127,255,212,0.05)',
              }}
            >
              <span
                className="font-black text-primary text-2xl"
                style={{ textShadow: '0 0 20px rgba(127,255,212,0.9), 0 0 40px rgba(127,255,212,0.4)' }}
              >
                BLZ
              </span>
            </div>
            {/* Spinning ring */}
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: '1px dashed rgba(127,255,212,0.15)',
                animationDuration: '8s',
              }}
            />
            {/* Ripple ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                border: '1px solid rgba(127,255,212,0.15)',
                animationDuration: '2.5s',
              }}
            />
          </div>
        </div>

        {/* Claimable label */}
        <span className="text-primary/60 text-[0.55rem] font-bold tracking-[0.2em] uppercase block mb-2">
          Claimable Amount
        </span>

        {/* Amount */}
        <p
          className="font-black text-5xl text-primary leading-none mb-1"
          style={{ textShadow: '0 0 20px rgba(127,255,212,0.6), 0 0 40px rgba(127,255,212,0.3)' }}
        >
          1,000
        </p>
        <p className="text-white/60 text-sm mb-6">BLZ · Once per 24 hours</p>

        {/* Countdown */}
        {info.timeUntilNextRequest > 0 && connected && (
          <div className="mb-6 max-w-xs mx-auto text-cyan-50">
            <CountDown seconds={info.timeUntilNextRequest} />
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={requestToken}
          disabled={loading || (connected && !info.canClaim)}
          className="
            bg-primary text-black font-black text-[0.7rem] tracking-widest uppercase
            px-10 py-3.5 rounded-xl cursor-pointer border-0
            shadow-[0_0_24px_rgba(127,255,212,0.3)]
            hover:bg-primary-hover hover:shadow-[0_0_36px_rgba(127,255,212,0.5)]
            hover:scale-[1.03] active:scale-100 active:bg-primary-active
            transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            disabled:hover:scale-100 disabled:hover:shadow-none
          "
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin inline-block" />
              Claiming Tokens...
            </span>
          ) : !connected
            ? 'Connect Wallet to Claim'
            : !info.canClaim
              ? 'Cooldown Active'
              : 'Request Tokens'}
        </button>

        {/* Claim count */}
        {/* {connected && (
          <p className="text-white/30 text-sm mt-4">
            Your claims:{' '}
            <span className="text-primary font-semibold">{info.}</span>
          </p>
        )} */}
      </div>

      {/* ── Balance card ── */}
      {connected && (
        <div
          className="relative border border-primary/15 rounded-2xl p-5 overflow-hidden hover:border-primary/30 transition-all duration-300"
          style={{ background: 'rgba(127,255,212,0.03)' }}
        >
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-5 h-px bg-primary/50" />
          <span className="absolute top-0 left-0 w-px h-5 bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-5 h-px bg-primary/50" />
          <span className="absolute bottom-0 right-0 w-px h-5 bg-primary/50" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary/50 text-[0.55rem] font-bold tracking-[0.2em] uppercase block mb-1.5">
                Your Balance
              </span>
              <p className="font-black text-2xl text-primary" style={{ textShadow: '0 0 12px rgba(127,255,212,0.4)' }}>
                {formatValue(info.balance)}
                <span className="text-sm text-white/30 ml-2 font-normal">BLZ</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-primary/50 text-[0.55rem] font-bold tracking-[0.2em] uppercase block mb-1.5">
                Wallet
              </span>
              <span className="text-sm text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full font-medium tracking-wide">
                {truncatedAddress}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};