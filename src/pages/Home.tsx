import ConnectDrawer from '../components/ConnectDrawer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold">Obelisk Wallet</h1>
        <p className="opacity-80 mt-2">Alien‑themed wallet — Sepolia ready, VOID soon™.</p>
      </div>
      <ConnectDrawer />
    </div>
  );
}
