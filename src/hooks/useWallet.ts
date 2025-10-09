import { useCallback, useEffect, useRef, useState } from 'react';

type AddChainParams = {
  chainId: `0x${string}`;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
};

declare global {
  interface Window { ethereum?: any }
}

const LS_KEY = 'obelisk_connected';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ethRef = useRef<any>(null);

  const toHexChainId = (id: number) => '0x' + id.toString(16);

  const handleAccountsChanged = useCallback((accs: string[]) => {
    if (accs && accs.length > 0) {
      setAddress(accs[0]);
      setIsConnected(true);
      localStorage.setItem(LS_KEY, '1');
    } else {
      setAddress(null);
      setIsConnected(false);
      localStorage.removeItem(LS_KEY);
    }
  }, []);

  const handleChainChanged = useCallback((hexId: string) => {
    try {
      const id = parseInt(hexId, 16);
      setChainId(id);
    } catch {
      setChainId(null);
    }
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    ethRef.current = eth;
    if (!eth) return;

    eth.on?.('accountsChanged', handleAccountsChanged);
    eth.on?.('chainChanged', handleChainChanged);

    const shouldAuto = localStorage.getItem(LS_KEY) === '1';
    if (shouldAuto) {
      (async () => {
        try {
          const accs: string[] = await eth.request({ method: 'eth_accounts' });
       	  handleAccountsChanged(accs);
          const hexId: string = await eth.request({ method: 'eth_chainId' });
          handleChainChanged(hexId);
        } catch {}
      })();
    }

    return () => {
      eth.removeListener?.('accountsChanged', handleAccountsChanged);
      eth.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const connect = useCallback(async () => {
    const eth = window.ethereum;
    if (!eth) throw new Error('No wallet found. Install MetaMask.');
    const accs: string[] = await eth.request({ method: 'eth_requestAccounts' });
    handleAccountsChanged(accs);
    const hexId: string = await eth.request({ method: 'eth_chainId' });
    handleChainChanged(hexId);
    localStorage.setItem(LS_KEY, '1');
  }, [handleAccountsChanged, handleChainChanged]);

  const disconnect = useCallback(async () => {
    localStorage.removeItem(LS_KEY);
    setIsConnected(false);
    setAddress(null);
    try { await ethRef.current?.request?.({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] }); } catch {}
  }, []);

  const switchAccount = useCallback(async () => {
    await disconnect();
    await connect();
  }, [disconnect, connect]);

  const switchOrAddChain = useCallback(async (opts: { chainId: number; add?: AddChainParams }) => {
    const eth = window.ethereum;
    if (!eth) throw new Error('No provider');
    const hex = toHexChainId(opts.chainId);
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] });
    } catch (e: any) {
      if (e?.code === 4902 && opts.add) {
        await eth.request({ method: 'wallet_addEthereumChain', params: [opts.add] });
      } else {
        throw e;
      }
    }
    const hexId: string = await eth.request({ method: 'eth_chainId' });
    handleChainChanged(hexId);
  }, [handleChainChanged]);

  return { address, chainId, isConnected, connect, disconnect, switchAccount, switchOrAddChain };
}
