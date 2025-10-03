export type ClaimPayload = {
  index: string | number
  account: string
  amount: string
  proof: string[]
}
export const PROOF_BASE_URL = 'https://rewards.deadspace.invalid/epoch/current'
export async function fetchClaim(address: string): Promise<ClaimPayload | null> {
  try {
    const url = `${PROOF_BASE_URL}/${address.toLowerCase()}.json`
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}
