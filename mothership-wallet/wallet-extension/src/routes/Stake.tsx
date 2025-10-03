import { useEffect, useState } from 'react'
import { getProvider, claimDeadOnL2, switchToDeadSpace } from '../srclib/chain'
import Tooltip from '../components/Tooltip'
import Confetti from '../components/Confetti'
import { signJoinEpoch, EPOCH_API } from '../srclib/holdStake'
import { fetchClaim } from '../srclib/proofFetcher'
import { claimOnEthereum } from '../srclib/ethClaim'

export default function Stake({setSwapping}:{setSwapping:(v:boolean)=>void}){
  const [addr,setAddr]=useState<string>()
  const [epoch,setEpoch]=useState<number>(0)
  const [hasClaim,setHasClaim]=useState(false); const [confettiTick,setConfettiTick]=useState(0)

  useEffect(()=>{(async()=>{
    const p=await getProvider(); const [a]=await p.send('eth_requestAccounts',[]); setAddr(a)
    try{ const r=await fetch(EPOCH_API + '/current'); if(r.ok){ const j=await r.json(); setEpoch(Number(j.epoch)||0) } }catch{}
    const claim = await fetchClaim(a); setHasClaim(!!claim)
  })()},[])

  async function joinFree(){
    const p=await getProvider()
    const payload = await signJoinEpoch(p, epoch)
    try{ await fetch(EPOCH_API + '/join', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }catch{}
    alert('Joined epoch (free). You can claim after publish.')
  }

  async function claimL2(){ setSwapping(true); try{ await switchToDeadSpace(); await claimDeadOnL2(); setConfettiTick(x=>x+1) } finally { setSwapping(false) } }
  async function claimL1(){
    if(!addr){ return }
    const claim = await fetchClaim(addr); if(!claim){ alert('No claim found'); return }
    await claimOnEthereum(claim); setConfettiTick(x=>x+1)
  }

  return(<div className="card">
    <div className="small">Stake by holding $XENO (sign only). Rewards: $DEAD on Dead Space; optional $wDEAD on Ethereum.</div>
    <button className="btn-primary" onClick={joinFree}>Join epoch (free)</button>
    <div className="grid" style={{marginTop:8}}>
      <button onClick={claimL2} disabled={!hasClaim}>Claim $DEAD (Dead Space)</button>
      <button onClick={claimL1} disabled={!hasClaim}>Claim $wDEAD (Ethereum)</button>
    </div>
  </div>)
}
