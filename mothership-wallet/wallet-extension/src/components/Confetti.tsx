import { useEffect, useRef } from 'react'
export default function Confetti({trigger}:{trigger:number}){
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    if(!trigger) return
    const c = ref.current!; const ctx = c.getContext('2d')!
    const W = c.width = 320, H = c.height = 160
    const parts = Array.from({length:120},()=>({x:Math.random()*W,y:-10,vy:1+Math.random()*2,vx:(Math.random()-0.5)*2,sz:2+Math.random()*3,life:120+Math.random()*60}))
    let t=0; let raf=0
    const step=()=>{
      ctx.clearRect(0,0,W,H)
      for(const p of parts){
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.02; p.life-=1
        ctx.fillRect(p.x,p.y,p.sz,p.sz)
      }
      t++; if(t<180) raf=requestAnimationFrame(step); else ctx.clearRect(0,0,W,H)
    }
    step(); return ()=>cancelAnimationFrame(raf)
  },[trigger])
  return <canvas ref={ref} style={{display:'block', margin:'8px auto'}} />
}
