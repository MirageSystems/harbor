# Harbor contracts

Foundry project for `LetterOfCredit`, the escrow contract described in the [contract spec](../docs/contract-spec.md).

## Setup

The dependencies are git submodules pinned to release tags:

| Dependency | Version |
| --- | --- |
| forge-std | v1.16.2 |
| OpenZeppelin Contracts | v5.6.1 |

If you cloned without `--recurse-submodules`, fetch them now:

```sh
git submodule update --init
```

Copy `.env.example` to `.env` before deploying anywhere other than anvil.

## Test

```sh
forge test
forge coverage --no-match-coverage "test|script"
```

## Local chain

Start `anvil`, then deploy with anvil's public default account 0. The deploy script reads the key from `PRIVATE_KEY`:

```sh
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

On a fresh chain the contract lands at `0x5FbDB2315678afecb367f032d93F642f64180aa3`.

The frontend batches reads through Multicall3, which anvil doesn't ship. Copy it over from Amoy once per anvil session:

```sh
CODE=$(cast code 0xcA11bde05977b3631167028862bE2a173976CA11 --rpc-url https://rpc-amoy.polygon.technology)
cast rpc anvil_setCode 0xcA11bde05977b3631167028862bE2a173976CA11 "$CODE" --rpc-url http://localhost:8545
```

## Deploy to Polygon Amoy

Set `PRIVATE_KEY` and `AMOY_RPC_URL` in `.env`. Add `POLYGONSCAN_API_KEY` if you want source verification. Forge loads `.env` on its own.

```sh
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
```

Record the new address in [docs/deployments.md](../docs/deployments.md).

## Demo cycle

`DemoCycle.s.sol` opens an LC, marks it delivered and logs balances and the minted NFT. It works against any deployment:

```sh
LOC_ADDRESS=0x... BUYER_KEY=0x... SELLER_KEY=0x... \
  forge script script/DemoCycle.s.sol --rpc-url amoy --broadcast
```
