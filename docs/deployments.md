# Deployments

## Polygon Amoy (chain 80002)

Deployed 2026-07-10 with throwaway testnet keys funded from the faucet.

| | Address |
| --- | --- |
| `LetterOfCredit` | [`0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`](https://amoy.polygonscan.com/address/0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35) |
| Deployer | `0x7d4488aE08962B5418264E084551b60C46C89f45` |
| Demo buyer | `0x2cE155593378a8e545e7b257CA45D8b69f569e77` |
| Demo seller | `0xCE41C7a24201Ab38D36eFBcC1F37688D36A5959D` |

First settlement cycle:

- LC #1 opened with 0.005 POL in escrow: [`0x2803…3f75`](https://amoy.polygonscan.com/tx/0x28038132958f0221d847d5f7c6e90082e4acb6df459de3118b73c70c6cfc3f75)
- LC #1 settled in one transaction, paying the seller and minting receivable NFT #1: [`0x8739…5800`](https://amoy.polygonscan.com/tx/0x873951eb3405b81056f21deaa0a9200f811dc966c8a00556aded99b559ee5800) (block 41888866)

Frontend config for this deployment:

```
NEXT_PUBLIC_CHAIN=amoy
NEXT_PUBLIC_LOC_ADDRESS=0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35
```

### Source verification

Not done yet. It needs a `POLYGONSCAN_API_KEY`:

```sh
cd contracts
forge verify-contract 0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35 \
  src/LetterOfCredit.sol:LetterOfCredit --chain 80002 --watch
```

Building `contracts/` at the pinned dependency versions gives executable bytecode identical to the deployed contract, checked on 2026-10-26. The CBOR metadata trailer differs. The deploy used an unpinned OpenZeppelin checkout whose source bytes differ slightly from the `v5.6.1` tag now pinned, and that checkout no longer exists. Expect a partial match on Sourcify. If Polygonscan rejects the metadata difference, redeploying from the pinned sources gives a fully reproducible contract.

## Local anvil (chain 31337)

Rehearsed on 2026-07-10 with anvil's public default accounts: account 0 deploys, account 1 buys, account 2 sells.

- `LetterOfCredit`: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- LC #1 opened with 2,400 POL: `0xa74b7b8acb92b9f0dc7ad59c6e5ba7455883721963d810a77f7e2287f84adeca`
- LC #1 settled, 2,400 POL paid and NFT #1 minted: `0x3d75ca293e9a83ddeecc4607448b25a33f689300e7a4cb07acb2d72bdd543264`

To reproduce, follow [contracts/README.md](../contracts/README.md#local-chain).
