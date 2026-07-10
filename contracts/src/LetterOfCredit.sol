// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Harbor Letter of Credit
/// @notice Self-executing LC escrow in native POL. The buyer opens an LC and
///         locks funds; the seller marks delivery, which settles in the same
///         transaction: funds move to the seller and an ERC-721 receipt for
///         the settled receivable is minted. No admin, no upgradeability.
/// @dev V1: the seller self-attests delivery (real oracle/eBL attestation is V2).
///      The LC id and the receipt tokenId are the same number.
contract LetterOfCredit is ERC721, ReentrancyGuard {
    enum Status {
        None,
        Open,
        Settled,
        Cancelled
    }

    struct LC {
        address buyer;
        address seller;
        uint256 amount;
        uint64 openedAt;
        uint64 settledAt;
        Status status;
        string memo;
    }

    error NotSeller();
    error NotBuyer();
    error WrongStatus();
    error ZeroAmount();
    error InvalidSeller();
    error TransferFailed();

    event LCOpened(
        uint256 indexed id, address indexed buyer, address indexed seller, uint256 amount, string memo
    );
    event LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt);
    event LCCancelled(uint256 indexed id);

    uint256 public nextId = 1;
    mapping(uint256 => LC) private _lcs;

    constructor() ERC721("Harbor Settled Receivable", "HSR") {}

    /// @notice Open an LC, escrowing `msg.value` for `seller`.
    /// @param seller Beneficiary; the only address that can mark delivery.
    /// @param memo Human-readable label (display only, e.g. a PO number).
    function openLC(address seller, string calldata memo) external payable returns (uint256 id) {
        if (msg.value == 0) revert ZeroAmount();
        if (seller == address(0) || seller == msg.sender) revert InvalidSeller();

        id = nextId++;
        _lcs[id] = LC({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            openedAt: uint64(block.timestamp),
            settledAt: 0,
            status: Status.Open,
            memo: memo
        });

        emit LCOpened(id, msg.sender, seller, msg.value, memo);
    }

    /// @notice Seller attests delivery; settles in the same transaction:
    ///         mints the receivable receipt and pays out the escrowed funds.
    function markDelivered(uint256 id) external nonReentrant {
        LC storage lc = _lcs[id];
        if (lc.status != Status.Open) revert WrongStatus();
        if (msg.sender != lc.seller) revert NotSeller();

        lc.status = Status.Settled;
        lc.settledAt = uint64(block.timestamp);

        _safeMint(lc.seller, id);

        (bool ok,) = lc.seller.call{value: lc.amount}("");
        if (!ok) revert TransferFailed();

        emit LCSettled(id, lc.seller, lc.amount, lc.settledAt);
    }

    /// @notice Buyer reclaims escrowed funds before delivery.
    /// @dev V1: no timelock; the buyer may cancel any open LC. Keeps demo
    ///      funds from being stranded by a mistyped seller address.
    function cancelLC(uint256 id) external nonReentrant {
        LC storage lc = _lcs[id];
        if (lc.status != Status.Open) revert WrongStatus();
        if (msg.sender != lc.buyer) revert NotBuyer();

        lc.status = Status.Cancelled;

        (bool ok,) = lc.buyer.call{value: lc.amount}("");
        if (!ok) revert TransferFailed();

        emit LCCancelled(id);
    }

    function getLC(uint256 id) external view returns (LC memory) {
        return _lcs[id];
    }
}
