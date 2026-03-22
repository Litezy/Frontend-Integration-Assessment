
import { useState } from 'react';
import { useOwnerFns } from '../../hooks/specific/useOwner';

interface Props {
    isOwner: boolean;
    decimals: number;
    onRefetch: () => void;
}

const MintAsOwner = ({ isOwner, decimals, onRefetch }: Props) => {
    const { OwnerMintToken, loading } = useOwnerFns();
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');


    const handleSubmit = async () => {
        if (!to || !amount || Number(amount) <= 0) return;
        const result = await OwnerMintToken(to, amount, decimals);
        if (result!.success) {
            setAmount("")
            setTo("")
            onRefetch()
        }
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                        background: 'radial-gradient(circle at 35% 30%, rgba(127,255,212,0.2), rgba(0,0,0,0.95))',
                        border: '1px solid rgba(127,255,212,0.35)',
                        boxShadow: '0 0 16px rgba(127,255,212,0.15)',
                    }}
                >
                    <span
                        className="font-black text-primary text-sm"
                        style={{ textShadow: '0 0 10px rgba(127,255,212,0.9)' }}
                    >
                        M
                    </span>
                </div>
                <div>
                    <p className="text-white font-bold text-xs md:text-sm tracking-wide">Mint Tokens</p>
                    <p className="text-white/30 text-[0.5rem] md:text-[0.6rem] tracking-[0.15em] uppercase mt-0.5">
                        Owner · Restricted Access
                    </p>
                </div>
                {/* Owner badge */}
                <div className="ml-auto flex items-center gap-1.5 bg-primary/5 border border-primary/20 rounded-full px-3 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_#7fffd4]" />
                    <span className="text-primary text-[0.55rem] font-bold tracking-widest uppercase">Owner Only</span>
                </div>
            </div>

            {isOwner &&
                <>
                    {/* Recipient input */}
                    <div className="space-y-2">
                        <label className="text-white/60 text-[0.6rem] font-bold tracking-[0.2em] uppercase block">
                            Recipient Address
                        </label>
                        <div
                            className="relative border border-primary/15 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 focus-within:border-primary/40"
                            style={{ background: 'rgba(127,255,212,0.02)' }}
                        >
                            {/* Corner accents */}
                            <span className="absolute top-0 left-0 w-4 h-px bg-primary/50" />
                            <span className="absolute top-0 left-0 w-px h-4 bg-primary/50" />
                            <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/50" />
                            <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/50" />

                            <div className="flex items-center gap-3 px-4 py-3.5">
                                <svg className="w-4 h-4 text-primary/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    type="text"
                                    value={to}
                                    onChange={e => setTo(e.target.value)}
                                    placeholder="0x..."
                                    className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-white/20 outline-none tracking-wide"
                                />
                                {to && (
                                    <button
                                        onClick={() => setTo('')}
                                        className="text-white/20 hover:text-white/50 transition-colors text-sm cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amount input */}
                    <div className="space-y-2">
                        <label className="text-white/60 text-[0.6rem] font-bold tracking-[0.2em] uppercase block">
                            Amount to Mint
                        </label>
                        <div
                            className="relative border border-primary/15 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 focus-within:border-primary/40"
                            style={{ background: 'rgba(127,255,212,0.02)' }}
                        >
                            {/* Corner accents */}
                            <span className="absolute top-0 left-0 w-4 h-px bg-primary/50" />
                            <span className="absolute top-0 left-0 w-px h-4 bg-primary/50" />
                            <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/50" />
                            <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/50" />

                            <div className="flex items-center gap-3 px-4 py-3.5">
                                <svg className="w-4 h-4 text-primary/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="Enter amount…"
                                    min="0"
                                    className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-white/20 outline-none tracking-wide [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-primary/50 text-sm font-bold tracking-widest">BLZ</span>
                            </div>
                        </div>

                        {/* Quick amount pills */}
                        <div className="flex gap-2 mt-2">
                            {['1,000', '10,000', '100,000', '1,000,000'].map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => setAmount(preset.replace(/,/g, ''))}
                                    className="text-[0.6rem] font-bold tracking-wide text-primary/50 border border-primary/15 rounded-full px-3 py-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 cursor-pointer"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    {to && amount && (
                        <div
                            className="relative border border-primary/15 rounded-xl p-4 overflow-hidden"
                            style={{ background: 'rgba(127,255,212,0.02)' }}
                        >
                            <span className="absolute top-0 left-0 w-4 h-px bg-primary/40" />
                            <span className="absolute top-0 left-0 w-px h-4 bg-primary/40" />
                            <span className="absolute bottom-0 right-0 w-4 h-px bg-primary/40" />
                            <span className="absolute bottom-0 right-0 w-px h-4 bg-primary/40" />

                            <p className="text-white/30 text-[0.55rem] font-bold tracking-[0.2em] uppercase mb-3">
                                Transaction Preview
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/60 text-sm">Recipient</span>
                                    <span className="text-white/70 text-sm font-medium font-mono">
                                        {to.slice(0, 6)}...{to.slice(-4)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/60 text-sm">Amount</span>
                                    <span className="text-primary text-sm font-bold">
                                        {Number(amount).toLocaleString()} BLZ
                                    </span>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Mint button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !to || !amount}
                        className=" w-full flex items-center justify-center gap-3  bg-primary text-black font-black text-[0.7rem] tracking-widest uppercase py-4 rounded-xl cursor-pointer border-0 shadow-[0_0_24px_rgba(127,255,212,0.3)]  hover:bg-primary-hover hover:shadow-[0_0_36px_rgba(127,255,212,0.5)] hover:scale-[1.02] active:scale-100 active:bg-primary-active transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-non "
                    >
                        {loading ? (
                            <>
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                Minting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Mint Tokens
                            </>
                        )}
                    </button>

                    {/* Warning */}
                    <p className="text-center text-white/20 text-[0.6rem] tracking-wide">
                        This action is irreversible · Only callable by contract owner
                    </p>
                </>
            }

        </div>
    );
};

export default MintAsOwner;