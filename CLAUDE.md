# Veil

Private DEX on MagicBlock PER. Shield / Swap / Unshield canonical SPL (SOL, USDC).

## Commands

```bash
bun install
bun dev
bun build
bun lint
```

## Env

Copy `.env.example` → `.env.local`. All vars are `NEXT_PUBLIC_*`.

## Key paths

- `lib/magicblock/` — Payments API clients (shield, swap, unshield, auth, tx)
- `lib/constants/tokens.ts` — devnet SOL + USDC mints
- `app/trade/page.tsx` — main 3-tab UI
- `.superstack/build-context.md` — stack + milestone status

## Build phases

See gitignored `docs/STEPS.md`. Phase 4 complete. Next: price stream + swap (Phase 5).

## Rules

- Private swaps only: `visibility: "private"`
- No custom Anchor program for MVP
- Devnet only
- Follow `sendTo` from MagicBlock API responses for RPC routing