# Harbor — Roadmap

**Product:** Harbor (by Mirage Systems) · **Chain:** Polygon · **Event:** Ignyte Challenges (DIFC × Polygon)
**Today:** 27 Jun 2026 · **Submission:** 13 Jul 2026 · **Demo Day:** Dubai, mid–late Sep 2026

The roadmap has one rule: **V1 exists only to win the hackathon.** Everything else waits.

---

## The one thing (frozen V1 scope)

A self-executing Letter of Credit that settles in ~90 seconds and pays the SME instantly.

**In scope for V1 — and nothing else:**
1. LC escrow contract holding USDC (buyer locks → auto-releases on delivery)
2. Receivable token minted on settlement → SME paid immediately
3. Email login via embedded wallet — no seed phrase, no gas, no "Polygon" on screen
4. Simulated delivery oracle (a signed "Mark delivered" action)
5. The split-screen demo: **traditional 10-day LC vs. Harbor's 90 seconds**, with real on-chain tx hashes

**Parking lot (V2+, do NOT build now — no exceptions):**
real oracles · electronic Bill of Lading (eBL/MLETR) · on-chain credit scoring · receivable financing pool · merchant payments · loyalty tokens · token economics/governance · multi-party (carrier/customs/both banks) · mainnet

> When a builder finishes early and says "we have time, let's add X" — the answer is **parking lot.** Extra time makes the *one screen* unforgettable. It does not add a second feature.

---

## Phase 0 — Win the submission (27 Jun → 13 Jul · 16 days)

Roster: **Builder A** (contracts), **Builder B** (frontend/UX), **PM** (story + glue + demo — no code).

| Days | Builder A — contracts | Builder B — the screen | PM — story & demo |
| --- | --- | --- | --- |
| **1–2** (Jun 27–28) | Repo + Amoy setup, deploy mock USDC, scaffold contracts | Next.js + embedded email wallet scaffold | Write the **exact 90-sec demo script**; build is built *to the script* |
| **3–6** (Jun 29–Jul 2) | Write + deploy + **verify** LC escrow & receivable token | Two-sided buyer/SME flow, wired to mock USDC | Deck draft + architecture writeup + GTM/revenue |
| **7–10** (Jul 3–6) | Contracts done → join integration | Integration: lock → mark delivered → release → mint → payout; the wow animation | Test the flow relentlessly; record rough cuts |
| **11–13** (Jul 7–9) | Bug-fix, gas/edge cases, explorer links | Lock the UI; the split-screen timer; polish | Record the **flawless 90-sec film**; finalize full pitch package |
| **14–15** (Jul 10–11) | Buffer / bug-bash | Buffer / bug-bash | Dry-run the pitch; assemble submission (≤40MB) |
| **16** (Jul 12) | — | — | **SUBMIT — one day early.** Platform/internet failure is *our* risk. |

**Definition of done (V1):** A judge clicks an explorer link, sees a real on-chain LC settle, watches an SME paid in 90 seconds against a 10-day baseline, never sees a wallet, and reads a one-page GTM naming the banks in the room.

**Buy, don't build (protects 2 builders):**
- Embedded wallet → Privy / thirdweb / Web3Auth (email login in an afternoon)
- No paymaster → testnet gas is free
- No real oracle → signed "Mark delivered" button
- No custom tokens → OpenZeppelin + a mock USDC

---

## Phase 1 — Win Demo Day (14 Jul → mid–late Sep)

Turn the prototype into a believable pilot using the DIFC/DevRel ecosystem intros.

- Replace the simulated oracle with **one real delivery signal** (DP World / customs / inspection hook)
- Add **eBL (MLETR)** so the LC is legally credible, not a toy
- Move settlement to **mainnet USDC**
- Stand up **one real corridor** through Jebel Ali with one bank or capital partner
- Tighten the live pitch for the Dubai stage

---

## Phase 2 — Scale (post-Sep)

- **Receivable financing pool** — capital providers fund the tokenized receivables; SMEs get paid early at scale (this is the play on the $2T gap)
- **On-chain trade credit scoring** — built from accumulated settlement data (now you have data to score against)
- **Decision: public Polygon vs. Polygon CDK app-chain** — driven by trade-data privacy needs
- **POL incentives** to grow the user base

---

## Phase 3 — Adjacent expansion (only after trade finance wins)

- Merchant payments / AED-stablecoin POS
- Loyalty tokenization
- Second port / second corridor

---

## North Star

> **Harbor turns real trade receivables into a yield pool that closes the $2 trillion gap** — institutional and DeFi capital funding real-world trade, where each SME's settlement history becomes portable, undercollateralized credit.

*Also on the horizon (post-Demo-Day — not the build list): negotiable eBL, multi-currency/AED settlement, a white-label rail for banks, Shariah-compliant (Murabaha/Wakala) structures, Digital Dirham/CBDC settlement, live port/IoT oracles, AI underwriting, and parametric trade insurance.*

---

## Risk watch

| Risk | Mitigation |
| --- | --- |
| Live demo fails on stage | Record a flawless film early; submit the film |
| Integration crunch (2 builders) | Builder A joins frontend from Day 6; front-load contracts |
| Scope creep ("we have the team") | Parking lot rule, enforced by PM |
| Submission-day platform failure | Submit one day early (Jul 12) |
| "Looks fake" | Real, verified contracts + clickable explorer tx hashes |
