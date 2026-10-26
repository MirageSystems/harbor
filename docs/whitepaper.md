# Harbor whitepaper

Mirage Systems · v0.2 · October 2026. First version written for the Ignyte Challenges (DIFC × Polygon), June 2026.

## Summary

Harbor is a trade-finance settlement layer on Polygon. It replaces the paper letter of credit, which takes 7 to 10 days, with a smart contract that settles in about 90 seconds. When delivery is confirmed, the same transaction pays the exporter and turns the paid invoice into an on-chain receivable. Users sign in with email and never manage a wallet or seed phrase.

This paper covers the problem, how Harbor works, the current MVP, and the path to a product launched from the DIFC.

## 1. The problem

Cross-border trade has a trust gap. The exporter wants payment before shipping, and the importer wants the goods before paying. Banks bridge this with the letter of credit (LC), a promise that the seller gets paid once they prove the goods shipped.

The instrument works. The process doesn't:

- More than USD 2 trillion of trade-finance demand goes unmet each year.
- About 40% of SME applications are rejected, around four times the rate for large companies. KYC and AML checks cost a bank nearly the same on a USD 50,000 deal as on a USD 5 million one, so small deals lose.
- One LC takes 7 to 10 days of paper and PDFs moving between banks, with people checking that every document matches. A typo or a wrong date sends it back.

Working capital sits frozen, and creditworthy small businesses get turned down by the process rather than by their actual risk.

## 2. Why the UAE first

- More than USD 50 billion in annual remittances and a USD 10.8 billion e-commerce market.
- About 30% crypto adoption, with stablecoins making up 51.3% of crypto activity.
- Comprehensive stablecoin regulation already in force.
- Jebel Ali Port handles more than 15 million TEUs a year. Each container is a trade that needs financing, documents and settlement.

## 3. What Harbor does

**A smart-contract letter of credit.** The buyer locks funds in an escrow contract. The seller can see that the money is committed. When delivery is confirmed, the contract pays the seller. No couriered documents and no manual discrepancy checks.

**A tokenized receivable.** The settling transaction also mints the paid invoice as an ERC-721 token owned by the seller. Today it is proof of settlement. Later it becomes something a financing pool can buy (section 6).

**No visible blockchain.** Users sign in with email. Privy creates an embedded wallet behind the scenes, and transactions go through without signing popups. A small business sees its LCs and balances, not wallets or chain names.

The parties don't trust each other, and that is the core problem. A shared ledger that releases payment on its own rules removes the need for that trust. That is the reason Harbor uses a blockchain.

## 4. How it works

```
Buyer ── openLC (locks funds) ──▶ LC escrow ── markDelivered ──▶ Seller paid
                                      │                            (same tx)
                                      └──── mints receivable ───▶ Seller
```

1. **Open.** The buyer opens an LC naming the seller and locks the funds.
2. **Ship.** The seller ships the goods.
3. **Confirm and settle.** Delivery is confirmed. In one transaction the contract pays the seller and mints the receivable.

Anyone can open that transaction in a block explorer and check the timestamps.

## 5. Architecture

| Layer | MVP (live on Amoy) | Production direction |
| --- | --- | --- |
| Chain | Polygon Amoy testnet | Polygon mainnet. Evaluate a Polygon CDK chain for trade-data privacy. |
| Contract | One `LetterOfCredit` contract on OpenZeppelin ERC-721, no admin | Add eBL (MLETR) transferable records |
| Settlement asset | Native POL | USDC or a regulated AED stablecoin |
| Wallets | Privy embedded email wallets. Users pay gas in POL but see no prompt. | Sponsored gas through account abstraction |
| Delivery signal | Seller confirms delivery | Real oracle: DP World, customs, inspection |
| Frontend | Next.js reading the chain directly | Same |

Why Polygon: transaction costs stay low at port-scale volume, the EVM tooling is mature, stablecoin liquidity is there, and the Ignyte program comes with Polygon ecosystem support.

## 6. Business model

- A fee on each LC settled through Harbor.
- A financing spread on receivables once the pool exists. Capital providers fund SME receivables for yield, and SMEs get paid early. This goes straight at the USD 2 trillion gap.
- An integration tier for banks that want to issue LCs on Harbor.

## 7. Roadmap

- **V1, done.** Escrow and one-transaction settlement on Amoy, with email login. Submitted to Ignyte in July 2026.
- **V2.** A real delivery oracle, eBL under MLETR, mainnet USDC, an external audit, and one live corridor through Jebel Ali.
- **V3.** A receivables financing pool and trade credit scoring built from settlement history.

Details in [roadmap.md](roadmap.md).

## 8. Go-to-market

Start with one corridor through Jebel Ali. Use the DIFC network, which reaches 289 banking institutions and more than 5,000 VCs, to land the first bank or capital partner. Prove settlement on one trade lane, then add corridors one at a time. Banks are the first customers and the source of capital, not competitors.

## 9. Team

Mirage Systems: two engineers and one product lead.

## 10. Status and disclaimers

Harbor is a testnet MVP. It runs on Polygon Amoy, settles in the chain's native token, and relies on the seller to confirm delivery. The contract has not had an external audit. Nothing here is financial advice or an offer of securities. Trade-finance and stablecoin activity in the UAE is regulated, and any production deployment will follow the DIFC and CBUAE frameworks.
