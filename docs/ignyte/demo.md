# Harbor — the demo, in plain English

*Companion to docs/demo-script.md (the shot-by-shot filming script). This is
the simple version: what we show, why it matters, what a judge can verify.
Target: one ~90-second Loom.*

## The story in three sentences

A letter of credit is how strangers trade across borders: the buyer's bank
promises the seller she'll get paid. Today that promise takes 10 days of
couriered paper to set up, and the seller still waits ~90 days for cash.
Harbor replaces the bank with a smart contract — same promise, settled in
about 90 seconds, and the seller is paid the moment delivery is confirmed.

## What the viewer sees

1. **The old world (10 seconds).** A timeline: Day 1 documents couriered,
   Day 4 bank review, Day 7 discrepancy, Day 10 still waiting. "This is trade
   finance today."
2. **Buyer locks funds (20 seconds).** Karl signs in **with just an email** —
   no wallet, no seed phrase, no crypto anything. He opens a letter of credit
   for Aisha and locks the funds. Her screen shows "funds secured" and a live
   timer starts ticking on the LC.
3. **Seller confirms delivery (15 seconds).** Aisha ships. When the goods
   arrive she clicks **Mark delivered** — one click, from her own
   email-login account.
4. **THE MOMENT (20 seconds).** That single click is also the settlement:
   payment releases to Aisha and her receivable is minted as an on-chain
   asset — one transaction, atomically. Her balance jumps. The card reads
   **"Settled in Ns"** — and that number is computed from the blockchain's
   own timestamps, not a stopwatch we drew.
5. **Verify it yourself (15 seconds).** Click the transaction hash. It opens
   the public Polygon explorer: the real contract, the real transfer, the
   real timestamps. "Don't take our word — the chain keeps the receipts."

## Why each beat is honest

- The 90-second figure is `settledAt - openedAt`, two on-chain timestamps
  anyone can check against the explorer.
- The escrow is a real deployed contract on Polygon Amoy
  (`0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`) — immutable, no admin keys.
- Email login is real (Privy embedded wallets); there is genuinely no seed
  phrase, gas prompt, or signing popup anywhere in the flow.
- Settlement asset is native POL on testnet; USDC is the stated mainnet plan,
  said once, honestly.
- Delivery is self-attested by the seller in V1; the real oracle/eBL
  integration is the stated V2. We say so.

## What we deliberately do NOT show

- Wallet addresses, gas, chains, or any crypto vocabulary
- The receivable NFT beyond one line ("her invoice is now an asset — that's
  the financing story, next phase")
- Cancel flows, admin anything (there is no admin), or a second live login
  (the seller window is pre-authenticated before recording)

## Recording checklist

- [ ] `.env.local` → Amoy; both persona accounts logged in and funded
- [ ] Contract source verified on Amoy Polygonscan (judges will click)
- [ ] One full dry run; settlement lands under 90s wall-clock
- [ ] Explorer tab pre-opened on the contract page
- [ ] Loom link added to README top and deck close
