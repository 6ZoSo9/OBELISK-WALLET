import { useEffect, useState } from 'react'
import { runtime } from '../srclib/runtime'

type Item = { nonce:string, direction:'L2->L1'|'L1->L2', amount:string, status:'locked'|'minted'|'burned'|'unlocked'|'unknown', txHash?:string, ts?:number, challengeSeconds?:number }
export default function BridgeStatus({address}:{address?:string}){
  const [items,setItems]=useState<Item[]>([])
  const [tick,setTick]=useState(0)
  const challengeDefault = runtime()?.challengeSeconds || 0

  useEffect(()=>{ const id=setInterval(()=>setTick(t=>t+1), 1000); return ()=>clearInterval(id) },[])

  useEffect(()=>{(async()=>{
    if(!address) return
    try{
      const res = await fetch(`/status/${address.toLowerCase()}`)
      if(res.ok){ const j = await res.json(); setItems(j.items||[]) }
    }catch{}
  })()},[address, tick % 10]) // refresh every 10s

  if(!address) return null

  function remaining(it:Item){
    if(!it.ts) return 0
    const total = it.challengeSeconds ?? challengeDefault
    if(total<=0) return 0
    const rem = Math.max(0, Math.floor(it.ts + total - Date.now()/1000))
    return rem
  }

  return (<div className="card">
    <div className="small">Bridge status for {address.slice(0,6)}…{address.slice(-4)}</div>
    <div style={{display:'grid', gap:8}}>
    {items.length===0? <div className="small">No bridge messages yet.</div> : items.map((it,i)=>{
      const rem = remaining(it)
      return (
      <div key={i} style={{display:'grid', gridTemplateColumns:'1fr auto', gap:6, alignItems:'center'}}>
        <div>
          <div className="small">{it.direction} • nonce {it.nonce.slice(0,10)}…</div>
          <div className="small">amount {it.amount} • {it.status}{rem>0?` • ${rem}s remaining`:''}</div>
        </div>
        {it.txHash ? <a href={it.txHash} target="_blank" rel="noreferrer">tx</a> : null}
      </div>
    )})}
    </div>
  </div>)
}
