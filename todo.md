# Harbor — Build TODO (V1 frozen scope)

Sequenced by demo risk: prove the on-chain settlement first, polish last.
Rule: don't touch the existing UI until step 4 — it's finished; contracts aren't.

## 1. Smart contracts (highest risk — do first)
- [x] Choose stack: Foundry + OpenZeppelin (ERC721, ReentrancyGuard only) — see docs/contract-spec.md
- [x] `LetterOfCredit.sol` — escrow: openLC (payable), markDelivered (settle + payout in one tx), cancelLC
- [x] Escrow asset: native POL ("USDC on mainnet" is the narrative)
- [x] ERC-721 receipt minted inside markDelivered (LC id == tokenId; no separate contract needed)
- [x] Tests: 22 passing, 100% line/statement/branch/function coverage incl. reentrancy + invariant fuzzing
- [x] Deploy + full settle cycle verified on local private network (anvil, chain 31337) — see docs/deployments.md
- [x] Deploy to Polygon Amoy — `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`
- [ ] Verify source on Amoy Polygonscan — deferred until POLYGONSCAN_API_KEY exists; can run any time post-deploy (`forge verify-contract`)
- [x] Milestone: real settlement tx on the public explorer — see docs/deployments.md

## 2. CLI/script driver (demo fallback + integration reference)
- [x] `script/DemoCycle.s.sol` — full cycle: open LC → mark delivered → settle, with balance/NFT logs
- [x] Rehearsed end-to-end on anvil: LC #1 opened and settled, 2400 POL paid, NFT minted
- [x] Rehearsed against Amoy: LC #1 opened + settled publicly (demo buyer/seller keys funded)

## 3. Embedded wallet auth
- [x] Privy — email-only login, embedded wallets, Amoy-only (PR #15; login gate + header wired)
- [ ] Pre-provision + pre-fund buyer and seller accounts (no live onboarding in demo)
- [ ] Decide: two real logins vs two browser windows with provisioned accounts (see kill-list discussion)

## 4. Wire the two-sided flow (longest stretch, known-shape work)
- [ ] Buyer: open LC + lock funds from the UI
- [ ] Seller: see LC, "Mark delivered" button
- [ ] Replace `SAMPLE_LCS` and hardcoded balances with contract reads/events
- [ ] Real tx hash in `SettlementCard` linking to Amoy explorer

## 5. Settlement moment (pure polish — dead last)
- [ ] 90-second timer / settlement animation in `SettlementCard`
- [ ] SplitCompare driven by the live settlement
- [ ] Rehearse the 90-second demo script end-to-end

## Scope cuts (in order, if time collapses)
1. Drop Receivable NFT — mention it, don't mint it
2. Drop seller login — "Mark delivered" fired from buyer session or CLI
3. Irreducible core: real escrow, real settlement tx, real explorer link, split-screen framing
