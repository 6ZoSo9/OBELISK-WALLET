import ConnectDrawer from '../components/ConnectDrawer';
import { useWallet } from '../hooks/useWallet';
import { useErc20Balance } from '../hooks/useErc20Balance';

export default function Home() {
  const { address } = useWallet();
  const bal = useErc20Balance();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto py-16 px-6 space-y-6">
        <h1 className="text-3xl font-bold">Obelisk Wallet</h1>
        <p className="opacity-80">Interface to the VOID network — rewards in VoidStones ($VOID)</p>

        <section className="grid gap-3">
          <card className="block border border-white/10 rounded-2xl p-4 bg-white/5">
            <div className="text-sm opacity-80">Connection</div>
            <div className="font-mono mt-1">{address ?? 'Not connected'}</div>
          </card>

          <card className="block border border-white/10 rounded-2xl p-4 bg-white/5">
            <div className="text-sm opacity-80">VoidStones Balance</div>
            <div className="mt-1 text-lg font-semibold">
              {bal.loading ? 'Loading…' : (bal.balance ?? '0')}
            </div>
            <div className="text-xs opacity-70 mt-1">
              Token: {bal.symbol ?? 'VoidStones (VOID)'} • Decimals: {bal.decimals ?? 18}
            </div>
            {bal.error && (
              <div className="text-xs text-red-300 mt-2">{bal.error}</div>
            )}
          </card>

          <card className="block border border-white/10 rounded-2xl p-4 bg-white/5">
            <div className="text-sm opacity-80">Secure the VOID</div>
            <div className="mt-1">Coming soon: Ghost / Wraith / Titan modes with resource caps and rewards in VoidStones.</div>
          </card>
        </section>
      </div>

      <ConnectDrawer />
    </div>
  );
}
