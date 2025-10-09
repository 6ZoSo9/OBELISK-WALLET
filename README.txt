# Wallet Sponsored Tx Composer (v2)

Adds a UI to encode calldata from an ABI and request **sponsor quotes**, with an optional **Send** button that works only if your relayer has ENABLE_EXECUTION=true.

## Files
- `src/components/SponsorComposerCard.tsx` — ABI input, function name + args, Encode → Quote / Send
- `src/lib/api.ts` — adds `sponsorSend()` alongside `sponsorQuote()`

## Apply
```bash
cd ~/dev/OBELISK-WALLET
unzip ~/Downloads/obelisk_wallet_sponsored_tx_ui_v2.zip
# Then in your Home.tsx, import and render the component:
# import SponsorComposerCard from '../components/SponsorComposerCard';
# ...
# <SponsorComposerCard />
npm run dev
```

## Relayer requirements
- Target address must be allowlisted in relayer `.env` (lowercase): `TARGETS_ALLOWLIST=0x...`
- Execution requires: `ENABLE_EXECUTION=true` and `SPONSOR_PRIVATE_KEY=0x<funded_key>` in relayer `.env`

Drop: 2025-10-08T21:52:31.091292
