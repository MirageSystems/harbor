# Harbor Contracts

Foundry project for the `LetterOfCredit` escrow (see `../docs/contract-spec.md`).

## Setup

Dependencies are not vendored. After cloning:

```sh
forge install foundry-rs/forge-std --no-git
forge install OpenZeppelin/openzeppelin-contracts --no-git
```

## Test

```sh
forge test
forge coverage --no-match-coverage "test|script"
```

## Deploy (Polygon Amoy)

Set `PRIVATE_KEY`, `AMOY_RPC_URL`, `POLYGONSCAN_API_KEY` in `.env`, then:

```sh
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
```

Full demo cycle (open → mark delivered → settle) against a deployment:

```sh
LOC_ADDRESS=0x... BUYER_KEY=0x... SELLER_KEY=0x... \
forge script script/DemoCycle.s.sol --rpc-url amoy --broadcast
```
