import { ethers } from 'ethers'
import { runtime } from './runtime'

export const ETH_CLAIM = { chainId: '0x1', rpcUrl: 'https://eth.llamarpc.com' }

export const abiMerkle=[{"type":"function","name":"claim","inputs":[{"name":"index","type":"uint256"},{"name":"account","type":"address"},{"name":"amount","type":"uint256"},{"name":"merkleProof","type":"bytes32[]"}],"outputs":[],"stateMutability":"nonpayable"}]
export const abiLockboxL1=[{"type":"function","name":"burnToL2","inputs":[{"type":"uint256"},{"type":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}]

export async function switchToEthereum(){
  const eth = (window as any).ethereum
  await eth.request({ method:'wallet_switchEthereumChain', params:[{ chainId: ETH_CLAIM.chainId }] })
}

export async function claimOnEthereum(claim:{index:string|number, account:string, amount:string, proof:string[]}){
  const conf = runtime()
  const distAddr = conf?.addressesL1?.merkleDistributorL1 || '0xMerkleDistributorOnEthereum'
  await switchToEthereum()
  const provider = new ethers.BrowserProvider((window as any).ethereum); const signer = await provider.getSigner()
  const dist = new (ethers as any).Contract(distAddr, abiMerkle, signer)
  const tx = await dist.claim(BigInt(claim.index as any), claim.account, BigInt(claim.amount as any), claim.proof as any); await tx.wait()
  alert('Claimed $wDEAD on Ethereum')
}

export async function burnWdeadToL2(amountWei: bigint, nonce: string){
  const conf = runtime()
  const l1Addr = conf?.addressesL1?.lockboxL1 || '0xL1Lockbox'
  await switchToEthereum()
  const provider = new ethers.BrowserProvider((window as any).ethereum); const signer = await provider.getSigner()
  const l1 = new (ethers as any).Contract(l1Addr, abiLockboxL1, signer)
  const tx = await l1.burnToL2(amountWei, nonce as any); await tx.wait()
  alert('Burned on Ethereum. After challenge window, unlock on Dead Space.')
}
