import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const DEFAULT_RPC = import.meta.env.VITE_PUBLIC_RPC || 'https://sepolia.infura.io/v3/'
const VOID_TOKEN = {
  address: import.meta.env.VITE_VOID_ADDRESS || '',
  abi: [
    // minimal ERC20 ABI
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)"
  ]
}

export default function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('0')
  const [tokenMeta, setTokenMeta] = useState({ name: 'VoidStones', symbol: 'VOID', decimals: 18 })

  useEffect(() => {
    const p = new ethers.BrowserProvider(window.ethereum ?? new ethers.JsonRpcProvider(DEFAULT_RPC))
    setProvider(p)
  }, [])

  const connect = async () => {
    if (!window.ethereum) return alert('No injected wallet found. Install MetaMask or similar.')
    const p = new ethers.BrowserProvider(window.ethereum)
    const accs = await p.send('eth_requestAccounts', [])
    setAccount(accs[0])
  }

  const refreshBalance = async () => {
    if (!provider || !account || !VOID_TOKEN.address) return
    const signer = await provider.getSigner()
    const token = new ethers.Contract(VOID_TOKEN.address, VOID_TOKEN.abi, signer)
    const dec = await token.decimals().catch(()=>18)
    const raw = await token.balanceOf(account)
    const fmt = ethers.formatUnits(raw, dec)
    const name = await token.name().catch(()=> 'VoidStones')
    const symbol = await token.symbol().catch(()=> 'VOID')
    setTokenMeta({ name, symbol, decimals: dec })
    setBalance(fmt)
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Obelisk Wallet</h1>
        <p className="text-zinc-400">Interface to the VOID network — rewards in VoidStones ($VOID)</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-xl border border-zinc-800">
          <h2 className="text-xl mb-2">Connection</h2>
          <button className="px-4 py-2 bg-zinc-800 rounded-lg" onClick={connect}>
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
          <div className="mt-3 text-sm text-zinc-400 break-all">
            {account || 'No account connected'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800">
          <h2 className="text-xl mb-2">VoidStones Balance</h2>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-zinc-800 rounded-lg" onClick={refreshBalance}>Refresh</button>
            <div className="text-lg">{balance}</div>
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            Token: {tokenMeta.name} ({tokenMeta.symbol}) • Decimals: {tokenMeta.decimals}
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            Set <code>VITE_VOID_ADDRESS</code> in <code>.env</code> to your deployed token to enable balance reads.
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 md:col-span-2">
          <h2 className="text-xl mb-2">Secure the VOID</h2>
          <p className="text-sm text-zinc-400">
            Coming soon: Ghost / Wraith / Titan modes with resource caps and rewards in VoidStones.
          </p>
        </div>
      </div>
    </div>
  )
}
