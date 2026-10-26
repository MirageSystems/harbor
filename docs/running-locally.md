# Running Harbor locally

This guide takes you through a full settlement on your machine: sign in, open a letter of credit as the buyer, mark it delivered as the seller, and watch the payout land.

Harbor has two roles. A wallet only sees the **Mark delivered** button on LCs where it is the seller, so you need a second identity to play the seller. Step 4 shows two ways to get one.

## Prerequisites

- Node 20 or later
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)
- A [Privy](https://dashboard.privy.io) app with email login enabled and `http://localhost:3111` in its allowed origins

Clone with submodules so the contract dependencies come along:

```sh
git clone --recurse-submodules https://github.com/MirageSystems/harbor.git
cd harbor
npm ci
cp .env.example .env.local
```

Put your Privy app ID in `.env.local`.

## What runs where

| Piece | Address |
| --- | --- |
| Frontend | http://localhost:3111 (`npm run dev`) |
| Local chain | http://localhost:8545 (`anvil`) |
| Contract on anvil | `0x5FbDB2315678afecb367f032d93F642f64180aa3` (first deploy on a fresh chain) |
| Contract on Amoy | `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35` |

`NEXT_PUBLIC_CHAIN` in `.env.local` picks the chain: `local` for anvil, `amoy` for the testnet. Set `NEXT_PUBLIC_LOC_ADDRESS` to match, then restart `npm run dev`.

## 1. Start a local chain

Skip this step if you're using Amoy.

```sh
anvil
```

In a second terminal, deploy the contract and inject Multicall3. The frontend batches its reads through Multicall3, and a fresh anvil chain doesn't have it. The commands are in [contracts/README.md](../contracts/README.md#local-chain).

## 2. Sign in as the buyer

1. Run `npm run dev` and open http://localhost:3111.
2. Choose **Sign in with email** and enter the 6-digit code Privy sends you.
3. Privy creates an embedded wallet. Its address shows in the header chip. Click it to copy the full address.

A new wallet starts with a balance of 0.

## 3. Fund the wallet

On anvil, send test POL from a pre-funded anvil account. The key below is anvil's public default account 0.

```sh
cast send <YOUR_WALLET_ADDRESS> --value 100ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

The balance card updates within about 2 seconds, because the UI polls the chain.

On Amoy, send from your own funded testnet wallet with `--rpc-url https://rpc-amoy.polygon.technology` and a small value such as `0.01ether`. The [Polygon faucet](https://faucet.polygon.technology) gives out Amoy POL.

## 4. Open a letter of credit

1. Click **Open a new letter of credit**.
2. Enter the seller's address. For a quick solo test on anvil, use anvil account 2: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`.
3. Enter a memo such as `PO-2026-0712` and an amount such as `25`.
4. Click **Open & lock funds**. The LC shows up as **Opened** and your balance drops by the amount.

## 5. Mark it delivered as the seller

Pick one of these.

**Solo, from the command line.** Settle as anvil account 2:

```sh
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "markDelivered(uint256)" <LC_ID> \
  --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a \
  --rpc-url http://localhost:8545
```

LC ids start at 1 and count up on each chain.

**Two browsers.** Open a private window at http://localhost:3111 and sign in with a different email. Use that wallet's address as the seller in step 4, send it a little POL for gas, then click **Mark delivered** in the private window.

## 6. Check the settlement

About 2 seconds after the settle transaction:

- The LC shows **Paid** in the buyer's list.
- The settlement card shows the amount, the time from open to settle, and the transaction hash. On Amoy the hash links to Polygonscan.
- The seller's balance goes up by the LC amount, and the seller owns receivable NFT `#<LC_ID>`.

The contract also has `cancelLC` for a buyer refund before delivery. The UI doesn't expose it.

## Troubleshooting

**"Chain Foundry does not support multicall3".** Anvil restarted without Multicall3. Run the inject command in [contracts/README.md](../contracts/README.md#local-chain).

**Balance stays at 0 after funding.** You funded a different address. Copy the one in the header chip.

**No Mark delivered button.** You're signed in as the buyer. See step 5.

**An LC you opened has disappeared.** Anvil restarted, which wipes the chain and the contract. Deploy again, or check that `.env.local` points at the chain you expect.

**The Privy login doesn't open.** Hard-refresh the page. If it still fails, check that `http://localhost:3111` is an allowed origin in your Privy app.
