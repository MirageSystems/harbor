# Deployments

## Local private network (anvil, chain-id 31337) — 2026-07-10

First complete deploy + settlement cycle. Anvil default dev accounts
(publicly known test keys): deployer = account 0, buyer = account 1,
seller = account 2.

- `LetterOfCredit`: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- LC #1 opened (2,400 POL escrowed): `0xa74b7b8acb92b9f0dc7ad59c6e5ba7455883721963d810a77f7e2287f84adeca`
- LC #1 settled — 2,400 POL paid to seller, receivable NFT #1 minted: `0x3d75ca293e9a83ddeecc4607448b25a33f689300e7a4cb07acb2d72bdd543264`

Reproduce: `anvil` in one terminal, then from `contracts/` run the Deploy
and DemoCycle scripts per `contracts/README.md` with the anvil keys.

## Polygon Amoy (testnet, chain-id 80002) — 2026-07-10

First public deploy + settlement. Throwaway demo keys, funded via faucet.

- `LetterOfCredit`: `0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`
- Deployer: `0x7d4488aE08962B5418264E084551b60C46C89f45`
- Demo buyer: `0x2cE155593378a8e545e7b257CA45D8b69f569e77`
- Demo seller: `0xCE41C7a24201Ab38D36eFBcC1F37688D36A5959D`
- LC #1 opened (0.005 POL escrowed):
  https://amoy.polygonscan.com/tx/0x28038132958f0221d847d5f7c6e90082e4acb6df459de3118b73c70c6cfc3f75
- **LC #1 settled — payout + receivable NFT #1 minted, one tx (the milestone):**
  https://amoy.polygonscan.com/tx/0x873951eb3405b81056f21deaa0a9200f811dc966c8a00556aded99b559ee5800
  (block 41888866, status success)

Frontend config for Amoy (`.env.local`):
`NEXT_PUBLIC_CHAIN=amoy`, `NEXT_PUBLIC_LOC_ADDRESS=0x5b1959F4a1542C72aD6a6f78e4F93a89BE947b35`

Source verification on Amoy Polygonscan deferred until a `POLYGONSCAN_API_KEY`
exists — run any time with `forge verify-contract`.
