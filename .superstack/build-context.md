# Veil — Build Context

Generated via [solana.new](https://www.solana.new/) scaffold workflow.

## Project

- **Name:** Veil
- **Type:** Private DEX (frontend-only MVP)
- **Hackathon:** Solana Blitz v5 — trading theme
- **Tagline:** Trade privately, settle publicly.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Package manager | bun |
| UI | Tailwind v4 + shadcn/ui |
| Wallet | Solana Wallet Adapter (Phase 2) |
| Privacy / SPL | MagicBlock Private Payments API |
| Pricing | MagicBlock `/v1/swap/quote` stream |
| Chain | Solana devnet |

## Architecture

Integrate-first (no custom Anchor program):

- **Shield** → `POST /v1/spl/deposit`
- **Swap** → `GET /v1/swap/quote` + `POST /v1/swap/swap` (`visibility: private`)
- **Unshield** → `POST /v1/spl/withdraw`
- **Portfolio** → `GET /v1/spl/private-balance` (bearer auth)

## solana.new skills in use

| Phase | Skill |
|-------|-------|
| Scaffold | `scaffold-project` |
| Build | `build-with-claude` |
| UI | `frontend-design-guidelines`, `brand-design`, `number-formatting` |
| Launch | `submit-to-hackathon` |

## build_status

```json
{
  "mvp_complete": false,
  "tests_passing": false,
  "devnet_deployed": false,
  "milestones": [
    {
      "id": "phase-1-scaffold",
      "name": "Scaffold project",
      "status": "complete"
    },
    {
      "id": "phase-2-wallet",
      "name": "Wallet connect",
      "status": "complete"
    },
    {
      "id": "phase-3-auth",
      "name": "MagicBlock auth",
      "status": "complete"
    },
    {
      "id": "phase-4-shield",
      "name": "Shield flow",
      "status": "complete"
    },
    {
      "id": "phase-5-swap",
      "name": "Price stream + swap",
      "status": "complete"
    },
    {
      "id": "phase-6-unshield",
      "name": "Unshield flow",
      "status": "pending"
    },
    {
      "id": "phase-7-portfolio",
      "name": "Portfolio",
      "status": "pending"
    }
  ]
}
```

## Local docs (gitignored)

- `docs/REFERENCE.md` — architecture
- `docs/STEPS.md` — phased build plan

## Next step

**Phase 2:** Wire Solana Wallet Adapter in `providers/wallet-provider.tsx`.