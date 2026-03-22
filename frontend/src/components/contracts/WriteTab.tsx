// // src/components/WriteTab.tsx
// import { useState } from 'react';
// import { type ToastData } from '../../types/index';

// interface Props {
//   connected: boolean;
//   address: string;
//   onToast: (t: Omit<ToastData, 'id'>) => void;
// }

// interface WriteCardProps {
//   title: string;
//   desc: string;
//   fnId: string;
//   activeLoading: string | null;
//   ownerOnly?: boolean;
//   onSubmit: () => void;
//   children: React.ReactNode;
// }

// const WriteCard = ({ title, desc, fnId, activeLoading, ownerOnly, onSubmit, children }: WriteCardProps) => (
//   <div className="relative bg-navy-mid border border-cyan/15 rounded-sm p-5
//                   hover:border-cyan/25 transition-colors duration-250">
//     <span className="absolute top-0 left-0 w-3.5 h-px bg-cyan/70" />
//     <span className="absolute top-0 left-0 w-px h-3.5 bg-cyan/70" />
//     <span className="absolute bottom-0 right-0 w-3.5 h-px bg-cyan/70" />
//     <span className="absolute bottom-0 right-0 w-px h-3.5 bg-cyan/70" />

//     <div className="flex items-start justify-between mb-1">
//       <p className="font-[cabinet] font-bold text-sm text-white">{title}</p>
//       {ownerOnly && (
//         <span className="font-[cabinet] text-[0.5rem] font-bold tracking-widest uppercase
//                          px-2 py-0.5 rounded-sm bg-cyan/10 border border-cyan/25
//                          text-cyan">
//           OWNER ONLY
//         </span>
//       )}
//     </div>
//     <p className="text-white/40 text-sm font-[DM_satoshi] mb-4 leading-relaxed">{desc}</p>

//     <div className="space-y-2.5 mb-3">
//       {children}
//     </div>

//     <button
//       onClick={onSubmit}
//       disabled={!!activeLoading}
//       className="w-full relative overflow-hidden border border-cyan text-cyan
//                  font-[cabinet] font-bold text-[0.6rem] tracking-widest uppercase
//                  px-4 py-2.5 rounded-sm cursor-pointer bg-transparent
//                  transition-all duration-200
//                  hover:text-navy hover:shadow-[0_0_20px_rgba(58,254,240,0.35)]
//                  hover:bg-cyan
//                  disabled:opacity-30 disabled:cursor-not-allowed"
//     >
//       <span className="flex items-center justify-center gap-2">
//         {activeLoading === fnId && (
//           <span className="w-3 h-3 rounded-full border border-current border-t-transparent
//                            animate-spin inline-block" />
//         )}
//         {activeLoading === fnId ? 'Sending…' : `Execute ${title}`}
//       </span>
//     </button>
//   </div>
// );

// // Shared input style
// const inputCls = `w-full bg-[#081422] border border-cyan/22 text-white
//                   font-[DM_satoshi] text-sm outline-none rounded-sm px-3.5 py-2.5
//                   placeholder:text-white/20
//                   focus:border-cyan/60 focus:shadow-[0_0_14px_rgba(58,254,240,0.1)]
//                   transition-all duration-200`;

// export const WriteTab = ({ connected, onToast }: Props) => {
//   const [loading, setLoading] = useState<string | null>(null);

//   // Form state
//   const [mintTo, setMintTo] = useState('');
//   const [mintAmt, setMintAmt] = useState('');
//   const [transferTo, setTransferTo] = useState('');
//   const [transferAmt, setTransferAmt] = useState('');
//   const [approveTo, setApproveTo] = useState('');
//   const [approveAmt, setApproveAmt] = useState('');
//   const [burnAmt, setBurnAmt] = useState('');
//   const [newOwner, setNewOwner] = useState('');

//   const exec = async (fnId: string, label: string, fn: () => Promise<void>) => {
//     if (!connected) { onToast({ type: 'error', message: 'Connect your wallet first.' }); return; }
//     setLoading(fnId);
//     onToast({ type: 'pending', message: `Broadcasting ${label}…` });
//     try {
//       await fn();
//       onToast({ type: 'success', message: `${label} executed successfully.` });
//     } catch (e: any) {
//       onToast({ type: 'error', message: e?.message ?? `${label} failed.` });
//     } finally {
//       setLoading(null);
//     }
//   };

//   return (
//     <div className="space-y-4 animate-slide-up">
//       {/* Info banner */}
//       <div className="bg-cyan/4 border border-cyan/15 rounded-sm p-3
//                       flex items-center gap-2">
//         <span className="text-cyan text-sm shrink-0">◈</span>
//         <p className="text-white/40 text-sm font-[DM_satoshi]">
//           Write functions broadcast signed transactions. Your wallet will prompt for confirmation.
//         </p>
//       </div>

//       {/* mint() */}
//       <WriteCard title="mint()" desc="Mint new BLZ to any address. Cannot exceed MAX_SUPPLY of 10,000,000."
//         fnId="mint" activeLoading={loading} ownerOnly
//         onSubmit={() => exec('mint', 'mint()', async () => {
//           // TODO: const tx = await contract.mint(mintTo, parseEther(mintAmt)); await tx.wait();
//           await new Promise(r => setTimeout(r, 1800));
//         })}>
//         <input className={inputCls} placeholder="Recipient address (0x...)" value={mintTo} onChange={e => setMintTo(e.target.value)} />
//         <input className={inputCls} type="number" placeholder="Amount (BLZ)" value={mintAmt} onChange={e => setMintAmt(e.target.value)} />
//       </WriteCard>

//       {/* requestToken() */}
//       <WriteCard title="requestToken()" desc="Claim 1,000 BLZ from the faucet. Once per 24 hours per address."
//         fnId="requestToken" activeLoading={loading}
//         onSubmit={() => exec('requestToken', 'requestToken()', async () => {
//           // TODO: const tx = await contract.requestToken(); await tx.wait();
//           await new Promise(r => setTimeout(r, 1800));
//         })}>
//         <div className="w-full bg-[#081422] border border-cyan/10 text-white/20
//                         font-[DM_satoshi] text-sm rounded-sm px-3.5 py-2.5 cursor-not-allowed">
//           No parameters required
//         </div>
//       </WriteCard>

//       {/* transfer() */}
//       <WriteCard title="transfer()" desc="Transfer BLZ from your wallet to another address."
//         fnId="transfer" activeLoading={loading}
//         onSubmit={() => exec('transfer', 'transfer()', async () => {
//           // TODO: const tx = await contract.transfer(transferTo, parseEther(transferAmt)); await tx.wait();
//           await new Promise(r => setTimeout(r, 1800));
//         })}>
//         <input className={inputCls} placeholder="Recipient address (0x...)" value={transferTo} onChange={e => setTransferTo(e.target.value)} />
//         <input className={inputCls} type="number" placeholder="Amount (BLZ)" value={transferAmt} onChange={e => setTransferAmt(e.target.value)} />
//       </WriteCard>

//       {/* approve() */}
//       <WriteCard title="approve()" desc="Allow a spender to use your BLZ via transferFrom()."
//         fnId="approve" activeLoading={loading}
//         onSubmit={() => exec('approve', 'approve()', async () => {
//           // TODO: const tx = await contract.approve(approveTo, parseEther(approveAmt)); await tx.wait();
//           await new Promise(r => setTimeout(r, 1800));
//         })}>
//         <input className={inputCls} placeholder="Spender address (0x...)" value={approveTo} onChange={e => setApproveTo(e.target.value)} />
//         <input className={inputCls} type="number" placeholder="Allowance (BLZ)" value={approveAmt} onChange={e => setApproveAmt(e.target.value)} />
//       </WriteCard>

//       {/* burn() */}
//       <WriteCard title="burn()" desc="Permanently destroy BLZ from your balance. Irreversible."
//         fnId="burn" activeLoading={loading}
//         onSubmit={() => exec('burn', 'burn()', async () => {
//           // TODO: const tx = await contract.burn(parseEther(burnAmt)); await tx.wait();
//           await new Promise(r => setTimeout(r, 1800));
//         })}>
//         <input className={inputCls} type="number" placeholder="Amount to burn (BLZ)" value={burnAmt} onChange={e => setBurnAmt(e.target.value)} />
//       </WriteCard>

//       {/* transferOwnership() */}
//       <WriteCard title="transferOwnership()" desc="Transfer contract ownership. You lose owner privileges immediately."
//         fnId="transferOwnership" activeLoading={loading} ownerOnly
//         onSubmit={() => exec('transferOwnership', 'transferOwnership()', async () => {
//           // TODO: const tx = await contract.transferOwnership(newOwner); await tx.wait();
//           await new Promise(r => setTimeout(r, 1800));
//         })}>
//         <input className={inputCls} placeholder="New owner address (0x...)" value={newOwner} onChange={e => setNewOwner(e.target.value)} />
//       </WriteCard>
//     </div>
//   );
// };