import { ethers } from 'ethers'
export const EPOCH_API = 'https://rewards.deadspace.invalid/epoch'
export type JoinPayload = { epoch: number, address: string, signature: string }
const domain = (chainId: number)=> ({ name: 'DeadSpaceHoldStake', version: '1', chainId, verifyingContract: '0x0000000000000000000000000000000000000000' })
const types = { HoldStake: [ { name: 'epoch', type: 'uint256' }, { name: 'staker', type: 'address' } ] }
export async function signJoinEpoch(provider: ethers.BrowserProvider, epoch: number){
  const signer = await provider.getSigner(); const addr = await signer.getAddress(); const net = await provider.getNetwork()
  const sig = await signer.signTypedData(domain(Number(net.chainId)), types as any, { epoch, staker: addr })
  return { epoch, address: addr, signature: sig } as JoinPayload
}
