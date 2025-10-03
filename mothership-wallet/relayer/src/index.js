import 'dotenv/config'
import express from 'express'
import { ethers } from 'ethers'
const app = express(); app.use(express.json())
const provider = process.env.RPC ? new ethers.JsonRpcProvider(process.env.RPC) : undefined
const wallet = provider && process.env.PRIVATE_KEY ? new ethers.Wallet(process.env.PRIVATE_KEY, provider) : undefined
app.post('/relay', async (req,res)=>{
  try{ if(!wallet) throw new Error('Relayer not configured'); const {to,data,value}=req.body
    const tx=await wallet.sendTransaction({to,data,value:value||0}); const rcpt=await tx.wait(); res.json({txHash:tx.hash,status:rcpt?.status})
  }catch(e){ res.status(500).json({error:e.message}) }
})
app.get('/health',(_,res)=>res.json({ok:true}))
app.listen(process.env.PORT||8787,()=>console.log('Relayer listening'))
