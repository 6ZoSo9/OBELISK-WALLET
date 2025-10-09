import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

type GasInfo = {
  gasPriceWei: string | null;
  maxFeePerGasWei: string | null;
  maxPriorityFeePerGasWei: string | null;
};

export default function ConnectDrawer() {
  const { address, chainId, isConnected, connect, disconnect, switchAccount, switchOrAddChain } = useWallet();
  const [open, setOpen] = useState(false);
  const relayer = import.meta.env.VITE_RELAYER_URL || '';

  const pretty = useMemo(() => address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Not connected', [address]);

  async function toSepolia() {
    const params = {
      chainId: '0xaa36a7' as const,
      chainName: 'Sepolia',
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://rpc.ankr.com/eth_sepolia'],
      blockExplorerUrls: ['https://sepolia.etherscan.io']
    };
    await switchOrAddChain({ chainId: 11155111, add: params });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="px-4 py-2 rounded-2xl shadow font-medium bg-white/10 text-white border border-white/15 backdrop-blur"
              onClick={() => setOpen(true)}>
        {isConnected ? pretty : 'Connect Wallet'}
      </button>

      {open && <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />}

      {open && (
        <div className="fixed bottom-0 right-0 w-full max-w-md bg-white text-gray-900 rounded-t-3xl shadow-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Obelisk Connect</h2>
            <button onClick={() => setOpen(false)} className="text-sm">Close</button>
          </div>

          <section className="space-y-2">
            <div className="text-sm opacity-80">Status</div>
            <div className="flex items-center justify-between border rounded-xl p-3 gap-3">
              <div className="text-sm">
                <div>{isConnected ? 'Connected' : 'Not connected'}</div>
                <div className="opacity-70 break-all">{pretty}</div>
              </div>
              <div className="flex items-center gap-2">
                {!isConnected ? (
                  <button className="px-3 py-1.5 rounded-xl shadow" onClick={connect}>Connect</button>
                ) : (
                  <>
                    <button className="px-3 py-1.5 rounded-xl shadow" onClick={switchAccount}>Switch account</button>
                    <button className="px-3 py-1.5 rounded-xl shadow" onClick={disconnect}>Disconnect</button>
                  </>
                )}
              </div>
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
  const [gas, setGas] = useState<GasInfo | null>(null);

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
        setGas({
          gasPriceWei: g.gasPriceWei ?? null,
          maxFeePerGasWei: g.maxFeePerGasWei ?? null,
          maxPriorityFeePerGasWei: g.maxPriorityFeePerGasWei ?? null
        });
      } catch { setGas(null); }
    })();
  }, [baseUrl]);

  return (
    <div className="grid gap-2">
      <Row label="Health" value={health} />
      <Row label="Chain" value={chain} />
      <Row label="Gas price" value={gas?.gasPriceWei ?? 'n/a'} />
      <Row label="Max fee per gas" value={gas?.maxFeePerGasWei ?? 'n/a'} />
      <Row label="Priority fee per gas" value={gas?.maxPriorityFeePerGasWei ?? 'n/a'} />
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
