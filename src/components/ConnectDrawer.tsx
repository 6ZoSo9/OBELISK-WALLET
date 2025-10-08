import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { SEPOLIA, toHexChainId, type AddChainParams } from '../lib/chains';

export default function ConnectDrawer() {
  const { address, chainId, isConnected, connect, switchOrAddChain } = useWallet();
  const [open, setOpen] = useState(false);
  const relayer = import.meta.env.VITE_RELAYER_URL || '';

  const pretty = useMemo(() => address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Not connected', [address]);

  async function toSepolia() {
    const params: AddChainParams = {
      chainId: toHexChainId(SEPOLIA.chainId),
      chainName: 'Sepolia',
      nativeCurrency: SEPOLIA.nativeCurrency,
      rpcUrls: SEPOLIA.rpcUrls,
      blockExplorerUrls: SEPOLIA.blockExplorerUrls
    };
    await switchOrAddChain({ chainId: SEPOLIA.chainId, add: params });
  }

  return (
    <div className="fixed bottom-6 right-6">
      <button className="px-4 py-2 rounded-2xl shadow font-medium" onClick={() => setOpen(true)}>
        {isConnected ? pretty : 'Connect Wallet'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {open && (
        <div className="fixed bottom-0 right-0 w-full max-w-md bg-white text-gray-900 rounded-t-3xl shadow-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Obelisk Connect</h2>
            <button onClick={() => setOpen(false)} className="text-sm">Close</button>
          </div>

          <section className="space-y-2">
            <div className="text-sm opacity-80">Status</div>
            <div className="flex items-center justify-between border rounded-xl p-3">
              <div className="text-sm">
                <div>{isConnected ? 'Connected' : 'Not connected'}</div>
                <div className="opacity-70">{pretty}</div>
              </div>
              {!isConnected && (
                <button className="px-3 py-1.5 rounded-xl shadow" onClick={connect}>Connect</button>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-sm opacity-80">Network</div>
            <div className="flex items-center justify-between border rounded-xl p-3">
              <div className="text-sm">Current chainId: {chainId ?? '—'}</div>
              <button className="px-3 py-1.5 rounded-xl shadow" onClick={toSepolia}>Use Sepolia</button>
            </div>
          </section>

          <section className="space-y-2">
            <div className="text-sm opacity-80">Relayer</div>
            <RelayerStatus baseUrl={relayer} />
          </section>
        </div>
      )}
    </div>
  );
}

function RelayerStatus({ baseUrl }: { baseUrl: string }) {
  const [health, setHealth] = useState<string>('…');
  const [chain, setChain] = useState<string>('…');
  const [gas, setGas] = useState<string>('…');

  useEffect(() => {
    if (!baseUrl) return;
    (async () => {
      try {
        const h = await fetch(`${baseUrl}/health`).then(r => r.json());
        setHealth(h.ok ? 'ok' : 'down');
      } catch { setHealth('down'); }

      try {
        const c = await fetch(`${baseUrl}/chain`).then(r => r.json());
        setChain(`${c.name} (${c.chainId})`);
      } catch { setChain('rpc error'); }

      try {
        const g = await fetch(`${baseUrl}/gas`).then(r => r.json());
        setGas(g.gasPriceWei ? `${g.gasPriceWei} wei` : 'n/a');
      } catch { setGas('rpc error'); }
    })();
  }, [baseUrl]);

  return (
    <div className="grid gap-2">
      <Row label="Health" value={health} />
      <Row label="Chain" value={chain} />
      <Row label="Gas price" value={gas} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border rounded-xl p-3">
      <div className="text-sm opacity-80">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
