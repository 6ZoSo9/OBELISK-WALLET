import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { ERC20_ABI } from '../lib/abi/erc20';
import { formatUnits } from '../lib/format';
import { useWallet } from './useWallet';

type Result = {
  loading: boolean;
  error?: string;
  symbol?: string;
  decimals?: number;
  balance?: string;
};

export function useErc20Balance() : Result {
  const { provider, address } = useWallet();
  const token = (import.meta as any).env.VITE_VOID_ADDRESS as string | undefined;

  const [state, setState] = useState<Result>({ loading: true });

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!provider || !address) {
        setState({ loading: false, error: 'Wallet not connected' });
        return;
      }
      if (!token || token.trim() === '') {
        setState({ loading: false, error: 'Set VITE_VOID_ADDRESS in .env to your deployed token to enable balance reads.' });
        return;
      }
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(token, ERC20_ABI, signer);
        const [decimals, symbol, raw] = await Promise.all([
          contract.decimals(),
          contract.symbol(),
          contract.balanceOf(address)
        ]);
        const bal = formatUnits(raw as bigint, Number(decimals));
        if (!mounted) return;
        setState({ loading: false, symbol, decimals: Number(decimals), balance: bal });
      } catch (e: any) {
        if (!mounted) return;
        setState({ loading: false, error: e?.message || 'Failed to read balance' });
      }
    }
    setState({ loading: true });
    run();
    return () => { mounted = false; };
  }, [provider, address, token]);

  return state;
}
