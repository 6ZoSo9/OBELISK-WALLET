import { useEffect, useState } from 'react'
import { getProvider, getBalances } from '../srclib/chain'

export default function Home(){
  const [addr,setAddr]=useState<string>()
  const [bal,setBal]=useState<{xeno:string,dead?:string}>()

  useEffect(()=>{(async()=>{
    const p=await getProvider()
    const [a]=await p.send('eth_requestAccounts',[])
    setAddr(a); setBal(await getBalances(a))
  })()},[])

  return(<>
    <div className="card">
      <div className="small">Account</div>
      <div style={{fontSize:22,fontWeight:700}}>{short(addr)}</div>
      <div className="small">XENO: {bal?.xeno ?? '0'} {bal?.dead?` · DEAD: ${bal.dead}`:''}</div>
    </div>
    <div className="card">
      <div className="small">Primary actions</div>
      <button className="btn-primary" onClick={()=>window.dispatchEvent(new Event('openSend'))}>Send</button>
    </div>
    <div className="card">
      <div className="small">Assets</div>
      <div className="asset"><div>$XENO</div><div>{bal?.xeno ?? '0'}</div></div>
      {bal?.dead && <div className="asset"><div>$DEAD</div><div>{bal.dead}</div></div>}
    </div>
  </>)
}

const short=(a?:string)=>a?`${a.slice(0,6)}…${a.slice(-4)}`:''
