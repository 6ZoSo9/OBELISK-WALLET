import { useEffect, useMemo, useState } from 'react';
import { BrowserProvider, Contract, isAddress, formatUnits } from 'ethers';
import { useWallet } from './useWallet';

type BalState = { loading: boolean; balance?: string; symbol?: string; decimals?: number; error?: string; };

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

const norm = (a?: string|null) => a && isAddress(a.trim()) ? a.trim() : undefined;

export function useErc20Balance(): BalState {
  const { address } = useWallet();
  const [state, setState] = useState<BalState>({ loading: false });

  const tokenAddr = useMemo(() => {
    const raw = (import.meta.env.VITE_VOID_ADDRESS as string | undefined)?.trim();
    return raw && isAddress(raw) ? raw : undefined;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ loading: true });

      const acct = norm(address);
      const token = norm(tokenAddr);

      // If token isn’t configured, show sane defaults (no warning line)
      if (!token) { if (!cancelled) setState({ loading:false, symbol:'VoidStones (VOID)', decimals:18 }); return; }

      try {
        if (!(window as any).ethereum) { if (!cancelled) setState({ loading:false, symbol:'VoidStones (VOID)', decimals:18 }); return; }
        const provider = new BrowserProvider((window as any).ethereum);
        const signerOrProv = await provider.getSigner().catch(() => provider);
        const erc20 = new Contract(token, ERC20_ABI, signerOrProv);

        const [decimals, symbol] = await Promise.all([
          erc20.decimals().then((d:number)=>Number(d)).catch(()=>18),
          erc20.symbol().catch(()=> 'VoidStones (VOID)')
        ]);

        if (!acct) { if (!cancelled) setState({ loading:false, symbol, decimals }); return; }

        const rawBal = await erc20.balanceOf(acct).catch(()=>0n);
        const human = formatUnits(rawBal, decimals);
        if (!cancelled) setState({ loading:false, balance:human, symbol, decimals });
      } catch {
        if (!cancelled) setState({ loading:false, symbol:'VoidStones (VOID)', decimals:18 });
      }
    })();
    return () => { cancelled = true; };
  }, [address, tokenAddr]);

  return state;
}
