# LetterOfCredit contract spec

Status: implemented and deployed on Polygon Amoy. Source: [`contracts/src/LetterOfCredit.sol`](../contracts/src/LetterOfCredit.sol).

## Design rules

- **One small contract.** About 100 lines, readable in one sitting.
- **Native POL escrow.** No ERC-20 approvals. USDC is planned for mainnet.
- **Delivery settles.** One transaction marks delivery, pays the seller and mints the receivable. There's no window where funds have left escrow but the receivable doesn't exist yet.
- **No admin.** No owner, proxy or pause switch. Nobody can move escrowed funds except through the three functions below.

The contract inherits OpenZeppelin `ERC721` for the receivable token and `ReentrancyGuard`.

## State

```solidity
enum Status { None, Open, Settled, Cancelled }

struct LC {
    address buyer;      // opened the LC and locked the funds
    address seller;     // the only address that can mark delivery
    uint256 amount;     // escrowed POL, in wei
    uint64  openedAt;   // block timestamp at open
    uint64  settledAt;  // 0 until settled
    Status  status;
    string  memo;       // display label, such as a PO number
}

uint256 public nextId = 1;   // next LC id, also the ERC-721 token id
mapping(uint256 => LC) private _lcs;
```

LC ids and receivable token ids are the same number.

## Functions

### `openLC(address seller, string memo) payable returns (uint256 id)`

Escrows `msg.value` for `seller`.

- Reverts with `ZeroAmount` if `msg.value == 0`.
- Reverts with `InvalidSeller` if `seller` is the zero address or the caller.
- Stores the LC as `Open` and emits `LCOpened`.

### `markDelivered(uint256 id)`

The seller attests delivery, and the LC settles in the same call. Protected by `nonReentrant`.

- Reverts with `WrongStatus` unless the LC is `Open`, and with `NotSeller` unless the caller is the seller.
- Sets `status = Settled` and `settledAt` before any external call.
- Mints receivable token `id` to the seller.
- Sends `amount` to the seller. Reverts the whole transaction with `TransferFailed` if the transfer fails.
- Emits `LCSettled`.

In V1 the seller is the delivery oracle. A real attestation from a carrier, customs or an eBL replaces this in V2.

### `cancelLC(uint256 id)`

The buyer takes back escrowed funds before delivery. Protected by `nonReentrant`.

- Reverts with `WrongStatus` unless the LC is `Open`, and with `NotBuyer` unless the caller is the buyer.
- Sets `status = Cancelled`, refunds the buyer and emits `LCCancelled`.

The buyer can cancel at any time before delivery. A timelock is planned for V2.

### Views

- `getLC(uint256 id) returns (LC)`
- `nextId()`. The frontend reads LCs `1` through `nextId - 1`. There is no pagination.

## Events

```solidity
event LCOpened(uint256 indexed id, address indexed buyer, address indexed seller, uint256 amount, string memo);
event LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt);
event LCCancelled(uint256 indexed id);
```

## Errors

`NotSeller`, `NotBuyer`, `WrongStatus`, `ZeroAmount`, `InvalidSeller`, `TransferFailed`.

## Invariants

The Foundry suite in [`contracts/test/`](../contracts/test/) checks these. Invariant fuzzing covers 1 and 4, and unit tests cover 2, 3 and 5.

1. The contract's balance equals the sum of `amount` over all `Open` LCs.
2. An LC settles at most once. `Settled` and `Cancelled` are final.
3. Only the stored seller can settle, and only the stored buyer can cancel.
4. Token `id` exists if and only if LC `id` is `Settled`, and it was minted to the seller.
5. `markDelivered` either completes all three effects (status, mint, payout) or reverts.

The suite also covers the happy path, each revert, a malicious seller contract that re-enters on receive, and fuzzed sequences of open, settle and cancel.

## Out of scope for V1

- ERC-20 or USDC escrow
- A real delivery oracle or eBL attestation
- Partial shipments, expiry, fees, or a market for receivables
- Upgrades, admin roles, pausing
