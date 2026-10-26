# Roadmap

## V1: testnet MVP (done, July 2026)

Built for the Ignyte Challenges and submitted in July 2026.

- `LetterOfCredit` escrow on Polygon Amoy. Delivery settles in one transaction that pays the seller and mints the receivable.
- Email login through Privy embedded wallets, with no signing popups.
- A dashboard for both buyer and seller, showing settlement time from on-chain timestamps.
- 22 Foundry tests, including reentrancy and invariant fuzzing.

The original 16-day build plan is in [ignyte/build-plan.md](ignyte/build-plan.md).

Still open from V1:

- Verify the contract source on Polygonscan. See [deployments.md](deployments.md#source-verification).

## V2: a credible pilot

Goal: one real trade lane through Jebel Ali with one bank or capital partner.

- Replace seller self-attestation with a real delivery signal from DP World, customs or an inspection agency.
- Add electronic bills of lading under MLETR, so the LC has legal standing.
- Settle in USDC on Polygon mainnet.
- Add a cancel timelock, so a buyer can't pull funds after the seller ships.
- Get an external audit before any mainnet deployment.

## V3: financing

- A receivables pool, where capital providers buy tokenized receivables and SMEs get paid early.
- Trade credit scoring built from settlement history.
- Decide between public Polygon and a Polygon CDK chain, based on trade-data privacy needs.

## Later

Ideas we haven't scoped: merchant payments in an AED stablecoin, more ports and corridors, Shariah-compliant structures (Murabaha, Wakala), and settlement in the Digital Dirham.
