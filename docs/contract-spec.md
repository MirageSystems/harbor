# Harbor V1 — Smart Contract Specification

Status: draft for review · Target: Polygon Amoy testnet · Tooling: Foundry · Deps: OpenZeppelin (ERC721, ReentrancyGuard only)

## Design principles

- **One contract, ~100 lines.** Small enough to read aloud during judging Q&A.
- **Native POL as the escrow asset.** No approvals, no faucet-hunting. Narrative: "USDC on mainnet."
- **Deliver = settle.** One transaction moves funds and mints the receipt. This is what makes the 90-second claim honest.
- **Immutable, no admin.** No Ownable, no proxies, no pause. The escrow answering to nobody *is* the pitch.

## Contract: `LetterOfCredit`

Inherits: `ERC721` (receivable receipt), `ReentrancyGuard`.

### State

```
enum Status { None, Open, Settled, Cancelled }

struct LC {
    address buyer;      // opened the LC, locked the funds
    address seller;     // beneficiary; may mark delivered
    uint256 amount;     // escrowed POL, wei
    uint64  openedAt;   // block.timestamp at open
    uint64  settledAt;  // 0 until settled
    Status  status;
    string  memo;  // human label, e.g. "PO-2024-0871 Kestrel Textiles" (display only)
}

uint256 nextId;                  // starts at 1; doubles as ERC-721 tokenId
mapping(uint256 => LC) lcs;
```

The LC id and the receivable NFT tokenId are the same number — one settlement, one token, no second counter.

### Functions

#### `openLC(address seller, string memo) payable returns (uint256 id)`
- Requires `msg.value > 0`, `seller != address(0)`, `seller != msg.sender`.
- Stores LC with `buyer = msg.sender`, `status = Open`, `amount = msg.value`.
- Emits `LCOpened(id, buyer, seller, amount, memo)`.

#### `markDelivered(uint256 id) nonReentrant`
The settlement moment. Single transaction:
- Requires `status == Open` and `msg.sender == lc.seller`.
  (V1 simplification: the seller *is* the delivery oracle. Real oracle/eBL attestation is V2.)
- Sets `status = Settled`, `settledAt = now` (effects before interactions).
- Mints ERC-721 `id` to seller (settled-receivable receipt).
- Transfers `amount` in POL to seller via low-level `call`; revert whole tx on failure.
- Emits `LCSettled(id, seller, amount, settledAt)`.

#### `cancelLC(uint256 id) nonReentrant`
Escape hatch so demo funds are never stranded:
- Requires `status == Open` and `msg.sender == lc.buyer`.
- V1: buyer may cancel any time pre-delivery (fine for demo; a timelock is noted as V2).
- Refunds `amount` to buyer, sets `status = Cancelled`, emits `LCCancelled(id)`.

#### Views
- `getLC(uint256 id) returns (LC)` — frontend reads one LC.
- `nextId()` — frontend enumerates 1..nextId-1. No pagination; demo scale only.

### Events (the frontend's data layer)

```
LCOpened(uint256 indexed id, address indexed buyer, address indexed seller, uint256 amount, string memo)
LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt)
LCCancelled(uint256 indexed id)
```

The UI's LC list, balances, and settlement card are driven by these events plus `getLC` reads. No off-chain database.

### Errors
Custom errors, not require-strings (cheaper, and Foundry surfaces them cleanly):
`NotSeller()`, `NotBuyer()`, `WrongStatus()`, `ZeroAmount()`, `InvalidSeller()`, `TransferFailed()`.

## Invariants (what the Foundry tests assert)

1. Contract balance == sum of `amount` over all `Open` LCs, always.
2. An LC settles at most once; `Settled` and `Cancelled` are terminal.
3. Only the stored seller can settle; only the stored buyer can cancel.
4. NFT `id` exists ⇔ LC `id` is `Settled`, and its owner started as the seller.
5. `markDelivered` either fully completes (status + mint + payout) or fully reverts.

## Test plan (minimum)

- Happy path: open → markDelivered → seller balance up by amount, NFT minted, event emitted.
- Reverts: settle by non-seller, settle twice, cancel by non-buyer, cancel after settle, open with zero value / zero seller / self as seller.
- Reentrancy: malicious seller contract re-entering on receive — must not double-pay.
- Fuzz: random amounts, invariant 1 holds across random open/settle/cancel sequences.

## Deployment

- Deploy to Amoy via `forge script`; verify source on Amoy Polygonscan (judges will click the tx hash — verified source is part of the demo).
- Record deployed address + one real settlement tx hash in `docs/deployments.md`.
- Same `forge script` doubles as the CLI demo driver (todo.md step 2).

## Explicitly out of scope (V1)

- ERC-20/USDC escrow (would add SafeERC20 + approve flow)
- Real delivery oracle / eBL attestation — seller self-attests in V1
- Partial shipments, expiry/timelock on cancel, fees, NFT transfer/financing market
- Upgradeability, admin roles, pausing
