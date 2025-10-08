# Obelisk Wallet — VOID Balance Integration (v1)

This drop adds ERC‑20 balance reads for VoidStones ($VOID) to the Home screen.

## What’s included
- `src/lib/abi/erc20.ts` — minimal ERC‑20 ABI
- `src/lib/format.ts` — bigint to decimal string formatter
- `src/hooks/useErc20Balance.ts` — React hook to read balance via Ethers v6
- `src/pages/Home.tsx` — updated to display connection + VOID balance
- `.env.template` — now includes `VITE_VOID_ADDRESS`

## Setup
1) In `OBELISK-WALLET`:
```
cp .env.template .env
# set VITE_VOID_ADDRESS=0xYourVoidToken
npm i
npm run dev
```
The balance will display after you connect your wallet and the token address is set.

## Notes
- Reads use `provider.getSigner()` to honor the connected account & network.
- Error messaging prompts user to set `VITE_VOID_ADDRESS` if missing.
