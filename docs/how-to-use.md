# How to run and test Harbor (current code)

The full user flow IS implemented: email login → embedded wallet → buyer opens
an LC (funds lock in the contract) → seller clicks "Mark delivered" → payout +
receivable NFT mint in one transaction → settlement card shows the real tx
hash. What trips people up is that the flow has TWO roles (buyer and seller),
and a wallet only sees the "Mark delivered" button for LCs where IT is the
seller.

## 0. What's running where

| Thing | Where | Started by |
|---|---|---|
| Frontend (Next.js) | http://localhost:3111 | `npx next dev -p 3111` |
| Local chain (anvil) | http://localhost:8545 | `anvil` |
| Contract (local) | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | forge Deploy script |
| Contract (Amoy) | `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35` | already deployed |

`.env.local` picks the chain: `NEXT_PUBLIC_CHAIN=local` (default, anvil) or
`amoy` + the Amoy address (commented pair in the file). Restart `next dev`
after changing it.

Fresh anvil? Two one-time setup steps (deploy + Multicall3 inject) — see
`contracts/README.md`.

## 1. Log in (become the BUYER)

1. Open http://localhost:3111
2. "Sign in with email" → enter your email → type the 6-digit code Privy sends.
3. Privy silently creates an embedded wallet for you. Its address shows at the
   top of the dashboard: `wallet 0x1234…abcd`.

You are now the buyer. Your balance reads 0 — a brand-new wallet has no funds.

## 2. Fund your wallet

On **local anvil**, send yourself test POL from a pre-funded anvil account
(paste your wallet address from the dashboard header):

```sh
cast send <YOUR_WALLET_ADDRESS> --value 100ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

Balance card updates within ~2 seconds (the UI polls the chain).

On **Amoy**, send from the funded deployer key in `contracts/.env` instead
(same command, `--rpc-url https://rpc-amoy.polygon.technology`, smaller value
e.g. `0.01ether`).

## 3. Open a letter of credit (buyer action)

1. Click **"Open a new letter of credit"** in Quick Actions.
2. Seller address: the wallet that will be allowed to settle. For a solo test
   use anvil account #2: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
   (or your second Privy login's wallet — see step 4B).
3. Memo: anything, e.g. `PO-2026-0712 Test`. Amount: e.g. `25` (POL).
4. Click **"Open & lock funds"** → the embedded wallet signs, funds move into
   the contract. The LC appears in the list as **Opened**, your balance drops.

## 4. Mark delivered (SELLER action — this is the part that confuses)

The "Mark delivered" button only renders for the LC's seller. Your buyer
login will never see it. Two ways to play the seller:

**A. Solo / fastest — settle from the CLI** (anvil account #2 as seller):

```sh
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "markDelivered(uint256)" <LC_ID> \
  --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a \
  --rpc-url http://localhost:8545
```

(LC id = position in the list; first LC you open on a chain with 2 existing
test LCs will be id 3.)

**B. Two-browser / the real demo** — open an incognito window (or second
browser) at localhost:3111, sign in with a DIFFERENT email, copy that wallet
address, use it as the seller in step 3, fund it a little for gas (step 2),
and click **"Mark delivered"** in the incognito window.

## 5. Watch the settlement

Within ~2s of the settle tx, in the buyer window:

- The LC flips to **Paid** in the list.
- The "Settled" section appears with the amount and the REAL tx hash — on
  Amoy it links to amoy.polygonscan.com.
- Seller's balance (in window B) jumps by the LC amount; the receivable
  NFT (same id as the LC) now belongs to the seller.

That's the whole loop. `cancelLC` exists on the contract (buyer refund before
delivery) but deliberately has no UI.

## Troubleshooting

- **"Chain Foundry does not support multicall3"** — fresh anvil is missing
  Multicall3; run the inject command in `contracts/README.md`.
- **Balance stuck at 0 after funding** — check you funded the address shown
  in the dashboard header (the embedded wallet), not an anvil account.
- **"Mark delivered" not visible** — you're logged in as the buyer, not the
  seller. See step 4.
- **Opened LC but nothing happened** — anvil probably restarted (fresh chain,
  contract gone). Redeploy per contracts/README.md, or check `.env.local`
  points at the chain you think it does.
- **Privy modal doesn't open** — hard-refresh; the page may have hydrated
  against a stale build.
