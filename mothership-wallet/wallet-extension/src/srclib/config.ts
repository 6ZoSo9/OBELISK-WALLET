export type ChainConfig = {
  DEAD_SPACE_CHAIN: any,
  addresses: any,
  addressesL1: any,
  proofBaseUrl: string
}
export async function fetchRuntimeConfig(): Promise<ChainConfig|null>{
  try{
    const res = await fetch('/config/config.json', { cache: 'no-store' })
    if(!res.ok) return null
    return await res.json()
  }catch{ return null }
}
