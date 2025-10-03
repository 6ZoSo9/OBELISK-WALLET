import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { lockDeadToL1, switchToDeadSpace } from '../srclib/chain'
import Tooltip from '../components/Tooltip'
import { burnWdeadToL2 } from '../srclib/ethClaim'
import BridgeStatus from '../components/BridgeStatus'
import { getProvider } from '../srclib/chain'

export default function Bridge({setSwapping}:{setSwapping:(v:boolean)=>void}){
  const [amount,setAmount]=useState('0')
  const [nonce,setNonce]=useState('')
  const [addr,setAddr]=useState<string>('')
  useEffect(()=>{(async()=>{ try{ const p=await getProvider(); const [a]=await (p as any).send('eth_requestAccounts',[]); setAddr(a) }catch{} })()},[])


  useEffect(()=>{ if(!nonce) setNonce(randomNonce()) },[])
  const amountWei = () => ethers.parseUnits(amount||'0',18)

  async function lockL2(){ setSwapping(true); try{ await switchToDeadSpace(); await lockDeadToL1(amountWei(), nonce) } finally { setSwapping(false) } }
  async function burnL1(){ await burnWdeadToL2(amountWei(), nonce) }

  return(<div className="card">
    <div className="small">Bridge between Dead Space (DEAD) and Ethereum (wDEAD)</div>
    <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
    <input placeholder="Nonce (auto)" value={nonce} onChange={e=>setNonce(e.target.value)}/>
    <div className="grid" style={{marginTop:8}}>
      <button onClick={lockL2}>Lock DEAD → mint wDEAD</button>
      <button onClick={burnL1}>Burn wDEAD → unlock DEAD</button>
    </div>
    <BridgeStatus address={addr}/>
  </div>)
}
function randomNonce(){ const a=new Uint8Array(32); crypto.getRandomValues(a); return '0x'+Array.from(a).map(x=>x.toString(16).padStart(2,'0')).join('') }
