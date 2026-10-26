# Harbor — Pitch Deck (content spec)

*Nine slides, one idea each. Visual language: the product's own poppy-sticker
design system (ink borders, primary blue, yellow highlights) — the deck should
look like the app. Screenshots over bullet points everywhere possible.*

---

## 1 · Title

**Harbor** — Letters of credit that settle in 90 seconds.
Live app URL · Loom link · Polygon Amoy · Ignyte Challenges (DIFC × Polygon)

## 2 · The problem, in one image

The traditional LC timeline, drawn as the product's split-compare panel:
Day 1 documents couriered → Day 4 bank review → Day 7 discrepancy → Day 10
still waiting… and the seller's cash arrives ~90 days later.
Caption: **"A $9T trade-finance market still runs on couriered paper."**

## 3 · Who bleeds: SMEs

The exporter ships $50,000 of goods, then waits months to be paid — or gets
rejected for an LC entirely (banks decline a huge share of SME trade-finance
applications; the global trade-finance gap is measured in trillions).
One sentence: **"The people who can least afford the wait, wait the longest."**

## 4 · What Harbor does (3 steps, zero jargon)

1. Buyer signs in with **email** and locks funds into an escrow contract.
2. Seller ships, then clicks **"Mark delivered."**
3. **The same transaction** pays the seller and mints her invoice as an
   on-chain asset. Done.
Diagram: buyer → [escrow] → seller, one arrow labeled "one transaction".

## 5 · THE moment (the credibility slide)

Full-bleed screenshot of the real settlement card: **"Settled in 87s"**,
payment released, receivable minted, transaction hash.
Caption: **"That number is computed from on-chain timestamps. Click the
hash — the chain keeps the receipts."**
→ Loom link goes HERE, not at the end.

## 6 · The invisible blockchain

Screenshot of the login card: "No wallet, no seed phrase — just your email."
Point: exporters will never install MetaMask, and with Harbor they never
have to. Embedded wallets, no gas prompts, no signing popups — the chain is
plumbing, not product.

## 7 · The receivable = the business

On settlement, the paid invoice exists as an on-chain asset (ERC-721).
Today: proof of settlement. Next: **instant financing against it** — the
seller sells the receivable to a liquidity pool and gets working capital in
minutes, not months. One slide only; the demo proves the foundation exists.

## 8 · Honest roadmap

- **V1 (done, live):** escrow + one-tx settlement on Polygon Amoy — real
  contract, real settlement txs, 22 tests / 100% coverage, immutable, no
  admin keys. Seller self-attests delivery (stated simplification).
- **V2:** real delivery oracle (eBL / MLETR), mainnet, USDC, first corridor
  through Jebel Ali.
- **V3:** receivable financing pool.
Rule inherited from the codebase: nothing on a slide a judge can falsify.

## 9 · Close

**"10 days → 90 seconds."**
Contract: `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35` (Amoy, verified)
Live app · Loom · Team · Mirage Systems

---

## Production notes

- Format: build as HTML in the app's design system → export PDF (confirm
  Ignyte's required format first).
- Slide 5 screenshot must be a REAL settlement — capture during the Loom
  recording session, same tx.
- Slide 2 reuses the README's ASCII split-compare, redrawn in the design
  system.
- Keep total reading time under 3 minutes; if a slide needs a paragraph,
  it's two slides or it's cut.
