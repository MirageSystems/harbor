# Harbor

Harbor settles a letter of credit on chain in about 90 seconds instead of 7 to 10 days. The buyer locks funds in an escrow contract on Polygon. When the seller confirms delivery, the same transaction pays the seller and mints the settled invoice as an ERC-721 token.

Users sign in with email. Privy creates an embedded wallet for them, so nobody handles a seed phrase or approves a signing popup.

Built by [Mirage Systems](https://github.com/MirageSystems) for the Ignyte Challenges (DIFC × Polygon).

## Status

Testnet MVP, submitted to Ignyte in July 2026. The contract is deployed on Polygon Amoy and has settled real transactions. It is not audited and not on mainnet.

| | |
| --- | --- |
| Contract | [`0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`](https://amoy.polygonscan.com/address/0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35) (Amoy, chain 80002) |
| First settlement | [`0x8739…5800`](https://amoy.polygonscan.com/tx/0x873951eb3405b81056f21deaa0a9200f811dc966c8a00556aded99b559ee5800) |
| Tests | 22 Foundry tests, including reentrancy and invariant fuzzing |

Known MVP limits:

- Escrow holds native POL. USDC is planned for mainnet.
- The seller attests delivery. A real delivery oracle is on the [roadmap](docs/roadmap.md).
- The buyer can cancel any open LC. There is no timelock.
- Users never see a gas prompt, but each embedded wallet pays gas in POL and needs a small balance.

## How it works

```
Buyer ── openLC (locks POL) ──▶ LetterOfCredit ── markDelivered ──▶ Seller paid
                                       │                               (same tx)
                                       └──── mints receivable #id ──▶ Seller
```

The contract is about 100 lines with no owner, no proxy and no pause switch. The frontend reads chain state directly with viem multicall polling. There is no backend or database. Settlement time on screen is `settledAt - openedAt`, taken from block timestamps.

Details: [contract spec](docs/contract-spec.md).

## Quickstart

Requirements: Node 20+, [Foundry](https://book.getfoundry.sh/getting-started/installation), and a [Privy](https://privy.io) app ID.

```sh
git clone --recurse-submodules https://github.com/MirageSystems/harbor.git
cd harbor
npm ci
cp .env.example .env.local   # add your Privy app ID
npm run dev                  # http://localhost:3111
```

By default the app talks to a local anvil chain, which needs the contract deployed and Multicall3 injected first. To use the live Amoy contract instead, set `NEXT_PUBLIC_CHAIN=amoy` in `.env.local`.

[Running locally](docs/running-locally.md) covers anvil setup, funding wallets, and testing both the buyer and seller roles.

Contracts:

```sh
cd contracts
forge test
```

## Repository layout

```
app/          Next.js app router entry
components/   UI components
hooks/        useHarbor: chain reads and writes
lib/          chain config, contract ABI, viem client
contracts/    Foundry project: LetterOfCredit, tests, deploy scripts
docs/         spec, roadmap, whitepaper, deployments
docs/ignyte/  hackathon material, kept as a record
```

## Documentation

- [Running locally](docs/running-locally.md)
- [Contract spec](docs/contract-spec.md)
- [Deployments](docs/deployments.md)
- [Roadmap](docs/roadmap.md)
- [Whitepaper](docs/whitepaper.md)
- [Ignyte submission material](docs/ignyte/)

## Security

Please report vulnerabilities privately. See [SECURITY.md](SECURITY.md).

## License

Copyright © 2026 Mirage Systems. All rights reserved. The source is published for reference and is not licensed for reuse. See [LICENSE](LICENSE).
