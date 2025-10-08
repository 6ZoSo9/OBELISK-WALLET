import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const isConnected = !!address;

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    const bp = new ethers.BrowserProvider(eth);
    setProvider(bp);

    const onAccountsChanged = (accs: string[]) => setAddress(accs[0] || null);
    const onChainChanged = async () => setChainId(Number(await eth.request({ method: 'eth_chainId' })));

    eth.on?.('accountsChanged', onAccountsChanged);
    eth.on?.('chainChanged', onChainChanged);

    (async () => {
      try {
        const accs = await bp.send('eth_accounts', []);
        if (accs?.[0]) setAddress(accs[0]);
        const cid = await bp.send('eth_chainId', []);
        setChainId(Number(cid));
      } catch {}
    })();

    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged);
      eth.removeListener?.('chainChanged', onChainChanged);
    };
  }, []);

  async function connect() {
    if (!provider) throw new Error('No wallet provider');
    const accs = await provider.send('eth_requestAccounts', []);
    setAddress(accs[0] || null);
  }

  async function switchOrAddChain(params: { chainId: number; add?: any }) {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error('No wallet provider');
    const hex = `0x${params.chainId.toString(16)}`;
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] });
    } catch (e: any) {
      if (params.add && e?.code === 4902) {
        await eth.request({ method: 'wallet_addEthereumChain', params: [params.add] });
      } else {
        throw e;
      }
    }
  }

  return { provider, address, chainId, isConnected, connect, switchOrAddChain };
}
