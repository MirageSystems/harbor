# Harbor

> **Where trade and capital settle, safely.**

Harbor turns a **7–10 day manual Letter of Credit into a ~90-second on-chain settlement** — and pays small businesses the moment their goods are delivered by tokenizing the receivable. Built on **Polygon**. Launched from **DIFC**.

A product by **Mirage Systems**, for the [Ignyte Challenges](#status) (DIFC × Polygon).

---

## The problem

Over **USD 2 trillion** in global trade finance goes unfilled every year. **40% of SME applications are rejected.** A single Letter of Credit takes **7–10 days** of manual, paper-based, error-prone processing — a typo can bounce the whole thing. The capital exists. The trust exists. The *rails* don't.

Meanwhile, **Jebel Ali Port** moves **15M+ TEUs a year**, the UAE has live, world-first stablecoin regulation, and stablecoins already make up **51.3%** of the country's crypto activity. The market is waiting for someone to connect the two.

## What Harbor does

- **Smart-contract Letter of Credit** — the buyer locks USDC into an on-chain escrow. Funds release *automatically* the moment delivery is confirmed. No couriered documents, no manual discrepancy checks, no ten-day wait.
- **Tokenized receivable** — the instant the LC settles, the SME's invoice becomes an on-chain asset and the SME is **paid immediately**, not in 90 days.
- **The chain is invisible** — email login, no wallet, no seed phrase, no gas. The user sees *"Approved."* They never see the word "Polygon."

## The 90-second demo

A split screen. On the left, a traditional LC ticks over: *Day 1 … Day 4 … Day 10.* On the right, Harbor: the buyer locks funds, the seller marks the shipment delivered, the contract verifies, payment releases, and the SME is paid — in **90 seconds, with a real transaction on Polygon you can open in the explorer.**

That single side-by-side *is* the product.

## Why now, why here

| Signal | Number |
| --- | --- |
| UAE annual remittances | USD 50B+ |
| UAE crypto adoption | ~30% |
| Stablecoin share of UAE crypto activity | 51.3% |
| Jebel Ali Port throughput | 15M+ TEUs / year |
| Comprehensive stablecoin regulation | Live (world-first) |

Regulatory clarity + real demand + a dense, addressable trade hub. The infrastructure is ready.

## Architecture (MVP)

```
  Buyer ──lock USDC──▶  [ LC Escrow Contract ]  ──delivery confirmed──▶  release payment
                                  │                                            │
                                  └────────── mints ──────────▶ [ Receivable Token ] ──▶ SME paid instantly
```

- **Chain:** Polygon Amoy testnet → mainnet
- **Contracts:** LC escrow + receivable token (Solidity, OpenZeppelin)
- **Settlement asset:** USDC (mock ERC-20 on testnet)
- **Wallet / UX:** embedded email wallet (no seed phrase); gasless on testnet
- **Delivery signal:** simulated oracle for the MVP → real DP World / customs / inspection feeds in V2
- **Frontend:** Next.js

## Repository structure

```
.
├── README.md            ← you are here
├── docs/
│   ├── whitepaper.md     ← the concise whitepaper
│   └── roadmap.md        ← phase-wise roadmap & frozen V1 scope
├── contracts/           ← LC escrow + receivable token (builders)
└── app/                 ← Next.js frontend (builders)
```

## Roadmap

Full plan in **[docs/roadmap.md](docs/roadmap.md)**. In short:

- **V1 — Win the hackathon (now → 13 Jul 2026):** the frozen scope above. One screen, one gasp.
- **V2 — Win Demo Day (→ Sep 2026):** real delivery oracle, electronic Bill of Lading (eBL / MLETR), one live corridor through Jebel Ali.
- **V3 — Scale:** receivable financing pool, on-chain trade credit scoring, merchant payments.

## Team

**Mirage Systems** — 2 builders + 1 PM/pitch.

## Status

Hackathon MVP for the **Ignyte Challenges** (DIFC × Polygon).
**Submission deadline:** 13 July 2026 · **Demo Day:** Dubai, mid–late September 2026.

## License

To be finalized. Per competition rules, a non-exclusive license to the winning submission is granted to Ignyte Challenges.
