# Harbor — The 90-Second Demo Script

**This is the single artifact everything else is built to.** The contract, the screens, and the recording all exist to make these 90 seconds happen. If a feature isn't on this page, it isn't in V1.

**Format:** Record it. Do not gamble on a live demo — film the flawless take and submit the film. Live pitch = play the film, then talk.

---

## The cast & setup

- **Aisha** — runs a textile workshop in Dubai. Our hero. Won a $50K export order; can't survive a 10-day approval and a 90-day payment wait.
- **Karl** — her buyer, an importer in Hamburg.

**Pre-staged before recording (so the only on-screen actions are clicks):**
- Contracts deployed **and verified** on Polygon Amoy.
- Karl's account pre-funded with **50,000 mock USDC**.
- Two views open side by side: **Karl (buyer)** and **Aisha (seller)** — plus a **"Traditional LC" day-counter** panel and a **Harbor timer** overlay.
- No faucet waits, no wallet popups mid-demo. Everything seeded.

---

## The beat sheet (≈90 seconds)

| Time | On screen | Voiceover | On-chain action |
| --- | --- | --- | --- |
| **0:00–0:08** · Hook | Split screen. Left: *"TRADITIONAL LC — Day 1."* Right: *"HARBOR."* The Harbor timer starts ticking. | "Aisha just won a 50,000-dollar export order. Her bank's letter of credit takes ten days — and she won't see the cash for ninety. Watch Harbor do it before this clip ends." | — (timer starts) |
| **0:08–0:25** · Lock | Karl signs in **with just an email** (show: no wallet popup). Opens an LC — seller *Aisha*, amount *50,000 USDC* — clicks **Lock funds**. Funds move to escrow. Status → **Opened**. | "Karl, her buyer, signs in with an email — no wallet, no crypto. He opens a letter of credit and locks 50,000 USDC into a smart contract. Now Aisha can trust the yes." | `openLC()` → escrow holds USDC |
| **0:25–0:45** · Ship | Switch to Aisha's view: **"Funds secured ✓."** She ships. A **port signal** fires: **"Goods delivered ✓."** | "Aisha sees the funds are secured, and ships. The moment delivery is confirmed — here, a port signal —" | `confirmDelivery()` → status **Delivered** |
| **0:45–1:05** · **THE WOW** | Contract auto-runs: **"Payment released" → "Receivable minted."** Aisha's balance jumps **+50,000**. A big **"SME PAID"** stamp lands. Harbor timer reads **~0:58**. | "— the contract pays her automatically and tokenizes the invoice. Aisha is paid. Instantly. Not in ninety days. Now." | `settle()` → pay seller **+** mint receivable |
| **1:05–1:20** · Proof | Click the **tx hash** → real **Polygon explorer** opens. Cut back: the left panel still reads *"Traditional LC — Day 1, awaiting document review."* | "Every step is real and on-chain — here it is on Polygon. The traditional letter of credit? Still on day one." | explorer link (real tx) |
| **1:20–1:30** · Close | Harbor logo. Big contrast card: **"10 days → 90 seconds · 90-day wait → instant."** | "Harbor. Where trade and capital settle, safely. Ten days becomes ninety seconds — and two trillion dollars of frozen trade starts moving." | — |

*Total voiceover ≈ 150 words. Speak at a calm pace; let the actions breathe.*

---

## The one wow moment

**0:45–1:05.** Everything builds to the instant the balance jumps and the "SME PAID" stamp lands while the timer is still under a minute. Direct the whole recording so the eye is on Aisha's balance at that second. That is the gasp. Don't crowd it.

---

## Production notes

- **Split-screen with a live clock overlay** — the timer racing toward 90s while the "Traditional" side sits on Day 1 *is* the story. Protect it.
- **Subtitles on.** Judges may watch muted.
- Amoy blocks confirm in ~2s — fine, but speed-ramp any confirmation pause so the pace never sags.
- Show the **email login** explicitly for 1–2 seconds. "No wallet" is half the UX score.
- End on the contrast card, not on a UI screen. Last frame should be the line, not a button.

---

## "Must be true to film this" — builder checklist

Everything below, and nothing more, is V1:

- [ ] Email login via embedded wallet (no seed phrase, no gas prompt)
- [ ] Buyer and seller views, viewable side by side
- [ ] `openLC()` · `confirmDelivery()` · `settle()` all working on Amoy, **contracts verified**
- [ ] Visible status lifecycle: **Opened → Delivered → Settled**
- [ ] Live balances that update (escrow in, seller paid out)
- [ ] Receivable token minted to the seller and visible
- [ ] Clickable tx hash → Polygon explorer
- [ ] Cosmetic-but-essential: the **Harbor timer** overlay + the **"Traditional LC" day-counter** panel

If it's not on this list, it's in the parking lot. See [`roadmap.md`](roadmap.md).
