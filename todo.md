# Harbor — Build TODO (V1 frozen scope)

Sequenced by demo risk: prove the on-chain settlement first, polish last.
Rule: don't touch the existing UI until step 4 — it's finished; contracts aren't.

## 1. Smart contracts (highest risk — do first)
- [x] Choose stack: Foundry + OpenZeppelin (ERC721, ReentrancyGuard only) — see docs/contract-spec.md
- [x] `LetterOfCredit.sol` — escrow: openLC (payable), markDelivered (settle + payout in one tx), cancelLC
- [x] Escrow asset: native POL ("USDC on mainnet" is the narrative)
- [x] ERC-721 receipt minted inside markDelivered (LC id == tokenId; no separate contract needed)
- [x] Tests: 22 passing, 100% line/statement/branch/function coverage incl. reentrancy + invariant fuzzing
- [ ] Deploy to Polygon Amoy; verify on Amoy explorer (`forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify` — needs PRIVATE_KEY, AMOY_RPC_URL, POLYGONSCAN_API_KEY in env)
- [ ] Milestone: one real settlement tx hash viewable on the explorer; record in docs/deployments.md

## 2. CLI/script driver (demo fallback + integration reference)
- [x] `script/DemoCycle.s.sol` — full cycle: open LC → mark delivered → settle, with balance/NFT logs
- [ ] Rehearse end-to-end against Amoy once deployed (needs funded BUYER_KEY/SELLER_KEY)

## 3. Embedded wallet auth
- [ ] Privy (fastest) — email login, no seed phrase/gas visible
- [ ] Pre-provision + pre-fund buyer and seller accounts (no live onboarding in demo)
- [ ] Decide: two real logins vs two browser windows with provisioned accounts

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
