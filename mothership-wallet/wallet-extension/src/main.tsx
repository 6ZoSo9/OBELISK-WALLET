import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { fetchRuntimeConfig } from './srclib/config'
import { setRuntimeConfig } from './srclib/runtime'

function Root(){
  const [ready,setReady]=useState(false)
  useEffect(()=>{(async()=>{
    const cfg = await fetchRuntimeConfig(); if(cfg) setRuntimeConfig(cfg); setReady(true)
  })()},[])
  if(!ready) return <div style={{padding:20}}>Loading…</div>
  return <App/>
}
createRoot(document.getElementById('root')!).render(<Root />)
