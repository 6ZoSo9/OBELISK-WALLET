import { ethers } from 'ethers'
import { fetchClaim } from './proofFetcher'
import { runtime, dsChain } from './runtime'

export const addresses = {
  deadToken: '0xYourDEADToken',
  lockboxL2: '0xDeadLockbox',
  merkleDistributorDeadSpace: '0xMerkleDistributorOnDeadSpace'
}

export const DEAD_SPACE_CHAIN = {
  chainId: '0xD5C0',
  chainName: 'Dead Space Chain',
  nativeCurrency: { name: 'DEAD', symbol: 'DEAD', decimals: 18 },
  rpcUrls: ['https://rpc.deadspace.invalid'],
  blockExplorerUrls: ['https://explorer.deadspace.invalid']
}

export const abiMerkle=[{"type":"function","name":"claim","inputs":[{"name":"index","type":"uint256"},{"name":"account","type":"address"},{"name":"amount","type":"uint256"},{"name":"merkleProof","type":"bytes32[]"}],"outputs":[],"stateMutability":"nonpayable"}]
export const abiLockboxL2=[{"type":"function","name":"lockToL1","inputs":[{"type":"address"},{"type":"uint256"},{"type":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}]

export async function getProvider(){
  if(!(window as any).ethereum) throw new Error('No injected provider')
  return new ethers.BrowserProvider((window as any).ethereum)
}

export async function switchToDeadSpace(){
  const eth = (window as any).ethereum
  const conf = dsChain()
  try{
    await eth.request({ method:'wallet_switchEthereumChain', params:[{ chainId: conf.chainId }] })
  }catch(e:any){
    if(e?.code === 4902){
      await eth.request({ method:'wallet_addEthereumChain', params:[conf] })
    } else throw e
  }
}

export async function claimDeadOnL2(){
  const conf = runtime()
  const proofBase = conf?.proofBaseUrl
  if(proofBase){ /* proofFetcher reads global base via server path; ok */ }
  await switchToDeadSpace()
  const p = await getProvider(); const s = await p.getSigner(); const account = await s.getAddress()
  const addr = (conf?.addresses?.merkleDistributorDeadSpace)||addresses.merkleDistributorDeadSpace
  const claim = await fetchClaim(account); if(!claim){ alert('No claim found'); return }
  const dist = new (ethers as any).Contract(addr, abiMerkle, s)
  const tx = await dist.claim(BigInt(claim.index as any), account, BigInt(claim.amount as any), claim.proof as any); await tx.wait()
  alert('Claimed $DEAD on Dead Space')
}

export async function lockDeadToL1(amountWei: bigint, nonce: string){
  await switchToDeadSpace()
  const p = await getProvider(); const s = await p.getSigner()
  const addr = (runtime()?.addresses?.lockboxL2)||addresses.lockboxL2
  const lockbox = new (ethers as any).Contract(addr, abiLockboxL2, s)
  const tx = await lockbox.lockToL1(await s.getAddress(), amountWei, nonce as any); await tx.wait()
  alert('Locked on Dead Space. After challenge window, mint wDEAD on Ethereum.')
}
