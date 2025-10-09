import { useWallet } from '../hooks/useWallet';

export default function AccountControlsCard() {
  const { address, chainId, isConnected, connect, disconnect, switchAccount, switchOrAddChain } = useWallet();

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
    <div className="border border-white/10 rounded-2xl p-4 bg-white/5">
      <div className="text-sm opacity-80 mb-2">Account Controls</div>
      <div className="text-xs opacity-70 mb-1">Status: {isConnected ? 'Connected' : 'Not connected'}</div>
      <div className="text-xs font-mono break-all mb-3">{address ?? '—'}</div>
      <div className="flex flex-wrap gap-2">
        {!isConnected ? (
          <button className="px-3 py-1.5 rounded-xl shadow bg-white/20" onClick={connect}>Connect</button>
        ) : (
          <>
            <button className="px-3 py-1.5 rounded-xl shadow bg-white/20" onClick={switchAccount}>Switch account</button>
            <button className="px-3 py-1.5 rounded-xl shadow bg-white/20" onClick={disconnect}>Disconnect</button>
          </>
        )}
        <button className="px-3 py-1.5 rounded-xl shadow bg-white/20" onClick={toSepolia}>
          Use Sepolia (chainId: {chainId ?? '—'})
        </button>
      </div>
    </div>
  );
}
