import './styles/metamaskish.css'
import Stake from './routes/Stake'
import Bridge from './routes/Bridge'
import { useState } from 'react'
import BlackHole from './components/BlackHole'

export default function App(){
  const [tab,setTab]=useState<'stake'|'bridge'>('stake')
  const [swapping,setSwapping]=useState(false)
  return(<div className="app">
    <TopBar/>
    <div className="tabs">
      <div className={`tab ${tab==='stake'?'active':''}`} onClick={()=>setTab('stake')}>Stake</div>
      <div className={`tab ${tab==='bridge'?'active':''}`} onClick={()=>setTab('bridge')}>Bridge</div>
    </div>
    {swapping && <BlackHole/>}
    {tab==='stake'?<Stake setSwapping={setSwapping}/>:<Bridge setSwapping={setSwapping}/>}
  </div>)
}

function TopBar(){
  return(<div className="topbar">
    <div className="logo">
      <img src="/icon-mask.svg" width={28} height={28} alt="alien"/>
      <strong>Mothership</strong>
    </div>
    <span className="small">Dead Space Chain</span>
  </div>)
}
