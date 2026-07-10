// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {LetterOfCredit} from "../src/LetterOfCredit.sol";

contract LetterOfCreditTest is Test {
    LetterOfCredit loc;

    address buyer = makeAddr("buyer");
    address seller = makeAddr("seller");
    address rando = makeAddr("rando");

    uint256 constant AMOUNT = 2_400 ether;

    event LCOpened(
        uint256 indexed id, address indexed buyer, address indexed seller, uint256 amount, string memo
    );
    event LCSettled(uint256 indexed id, address indexed seller, uint256 amount, uint64 settledAt);
    event LCCancelled(uint256 indexed id);

    function setUp() public {
        loc = new LetterOfCredit();
        vm.deal(buyer, 1_000_000 ether);
    }

    function _open() internal returns (uint256 id) {
        vm.prank(buyer);
        id = loc.openLC{value: AMOUNT}(seller, "PO-2024-0871 Kestrel Textiles");
    }

    // ---------- openLC ----------

    function test_openLC_storesLCAndEmits() public {
        vm.expectEmit(true, true, true, true);
        emit LCOpened(1, buyer, seller, AMOUNT, "PO-2024-0871 Kestrel Textiles");
        uint256 id = _open();

        assertEq(id, 1);
        assertEq(loc.nextId(), 2);
        assertEq(address(loc).balance, AMOUNT);

        LetterOfCredit.LC memory lc = loc.getLC(id);
        assertEq(lc.buyer, buyer);
        assertEq(lc.seller, seller);
        assertEq(lc.amount, AMOUNT);
        assertEq(lc.openedAt, uint64(block.timestamp));
        assertEq(lc.settledAt, 0);
        assertEq(uint8(lc.status), uint8(LetterOfCredit.Status.Open));
        assertEq(lc.memo, "PO-2024-0871 Kestrel Textiles");
    }

    function test_openLC_idsIncrement() public {
        assertEq(_open(), 1);
        assertEq(_open(), 2);
        assertEq(_open(), 3);
    }

    function test_openLC_revertsOnZeroValue() public {
        vm.prank(buyer);
        vm.expectRevert(LetterOfCredit.ZeroAmount.selector);
        loc.openLC{value: 0}(seller, "x");
    }

    function test_openLC_revertsOnZeroSeller() public {
        vm.prank(buyer);
        vm.expectRevert(LetterOfCredit.InvalidSeller.selector);
        loc.openLC{value: 1 ether}(address(0), "x");
    }

    function test_openLC_revertsOnSelfSeller() public {
        vm.prank(buyer);
        vm.expectRevert(LetterOfCredit.InvalidSeller.selector);
        loc.openLC{value: 1 ether}(buyer, "x");
    }

    // ---------- markDelivered ----------

    function test_markDelivered_paysSellerMintsNFTAndEmits() public {
        uint256 id = _open();
        uint256 sellerBefore = seller.balance;

        vm.warp(block.timestamp + 90);
        vm.expectEmit(true, true, true, true);
        emit LCSettled(id, seller, AMOUNT, uint64(block.timestamp));
        vm.prank(seller);
        loc.markDelivered(id);

        assertEq(seller.balance, sellerBefore + AMOUNT);
        assertEq(address(loc).balance, 0);
        assertEq(loc.ownerOf(id), seller);

        LetterOfCredit.LC memory lc = loc.getLC(id);
        assertEq(uint8(lc.status), uint8(LetterOfCredit.Status.Settled));
        assertEq(lc.settledAt, uint64(block.timestamp));
    }

    function test_markDelivered_revertsForNonSeller() public {
        uint256 id = _open();
        vm.prank(rando);
        vm.expectRevert(LetterOfCredit.NotSeller.selector);
        loc.markDelivered(id);

        vm.prank(buyer);
        vm.expectRevert(LetterOfCredit.NotSeller.selector);
        loc.markDelivered(id);
    }

    function test_markDelivered_revertsIfSettledTwice() public {
        uint256 id = _open();
        vm.startPrank(seller);
        loc.markDelivered(id);
        vm.expectRevert(LetterOfCredit.WrongStatus.selector);
        loc.markDelivered(id);
        vm.stopPrank();
    }

    function test_markDelivered_revertsOnUnknownId() public {
        vm.prank(seller);
        vm.expectRevert(LetterOfCredit.WrongStatus.selector);
        loc.markDelivered(999);
    }

    function test_markDelivered_revertsAfterCancel() public {
        uint256 id = _open();
        vm.prank(buyer);
        loc.cancelLC(id);
        vm.prank(seller);
        vm.expectRevert(LetterOfCredit.WrongStatus.selector);
        loc.markDelivered(id);
    }

    function test_markDelivered_revertsIfSellerRejectsPayment() public {
        RejectingSeller bad = new RejectingSeller(loc);
        vm.prank(buyer);
        uint256 id = loc.openLC{value: AMOUNT}(address(bad), "x");

        vm.expectRevert(LetterOfCredit.TransferFailed.selector);
        bad.settle(id);

        // whole tx reverted: still open, no NFT, funds still escrowed
        assertEq(uint8(loc.getLC(id).status), uint8(LetterOfCredit.Status.Open));
        assertEq(address(loc).balance, AMOUNT);
        vm.expectRevert();
        loc.ownerOf(id);
    }

    // ---------- cancelLC ----------

    function test_cancelLC_refundsBuyerAndEmits() public {
        uint256 id = _open();
        uint256 buyerBefore = buyer.balance;

        vm.expectEmit(true, false, false, true);
        emit LCCancelled(id);
        vm.prank(buyer);
        loc.cancelLC(id);

        assertEq(buyer.balance, buyerBefore + AMOUNT);
        assertEq(address(loc).balance, 0);
        assertEq(uint8(loc.getLC(id).status), uint8(LetterOfCredit.Status.Cancelled));
    }

    function test_cancelLC_revertsForNonBuyer() public {
        uint256 id = _open();
        vm.prank(seller);
        vm.expectRevert(LetterOfCredit.NotBuyer.selector);
        loc.cancelLC(id);
    }

    function test_cancelLC_revertsAfterSettle() public {
        uint256 id = _open();
        vm.prank(seller);
        loc.markDelivered(id);
        vm.prank(buyer);
        vm.expectRevert(LetterOfCredit.WrongStatus.selector);
        loc.cancelLC(id);
    }

    function test_cancelLC_revertsIfCancelledTwice() public {
        uint256 id = _open();
        vm.startPrank(buyer);
        loc.cancelLC(id);
        vm.expectRevert(LetterOfCredit.WrongStatus.selector);
        loc.cancelLC(id);
        vm.stopPrank();
    }

    function test_cancelLC_revertsIfBuyerRejectsRefund() public {
        RejectingBuyer badBuyer = new RejectingBuyer(loc);
        vm.deal(address(badBuyer), AMOUNT);
        uint256 id = badBuyer.open(seller, AMOUNT);

        vm.expectRevert(LetterOfCredit.TransferFailed.selector);
        badBuyer.cancel(id);

        assertEq(uint8(loc.getLC(id).status), uint8(LetterOfCredit.Status.Open));
        assertEq(address(loc).balance, AMOUNT);
    }

    // ---------- reentrancy ----------

    function test_reentrantSellerCannotDoublePay() public {
        ReentrantSeller attacker = new ReentrantSeller(loc);
        vm.startPrank(buyer);
        uint256 id1 = loc.openLC{value: AMOUNT}(address(attacker), "target");
        loc.openLC{value: AMOUNT}(address(attacker), "second");
        vm.stopPrank();

        attacker.attack(id1);

        // attacker got exactly one payout; the second LC is untouched
        assertEq(address(attacker).balance, AMOUNT);
        assertEq(address(loc).balance, AMOUNT);
        assertTrue(attacker.reentryBlocked());
    }

    // ---------- independence of multiple LCs ----------

    function test_multipleLCsAreIndependent() public {
        address seller2 = makeAddr("seller2");
        vm.startPrank(buyer);
        uint256 a = loc.openLC{value: 1 ether}(seller, "a");
        uint256 b = loc.openLC{value: 2 ether}(seller2, "b");
        vm.stopPrank();

        vm.prank(seller);
        loc.markDelivered(a);

        assertEq(uint8(loc.getLC(b).status), uint8(LetterOfCredit.Status.Open));
        assertEq(address(loc).balance, 2 ether);
        assertEq(seller.balance, 1 ether);
    }

    // ---------- fuzz ----------

    function testFuzz_openAndSettle(uint96 amount, address fSeller) public {
        vm.assume(amount > 0);
        vm.deal(buyer, amount);
        vm.assume(fSeller != address(0) && fSeller != buyer);
        vm.assume(fSeller.code.length == 0);
        assumeNotPrecompile(fSeller);

        vm.prank(buyer);
        uint256 id = loc.openLC{value: amount}(fSeller, "fuzz");

        uint256 before = fSeller.balance;
        vm.prank(fSeller);
        loc.markDelivered(id);

        assertEq(fSeller.balance, before + amount);
        assertEq(loc.ownerOf(id), fSeller);
        assertEq(address(loc).balance, 0);
    }

    function testFuzz_openAndCancel(uint96 amount) public {
        vm.assume(amount > 0);
        vm.deal(buyer, amount);
        vm.prank(buyer);
        uint256 id = loc.openLC{value: amount}(seller, "fuzz");

        uint256 before = buyer.balance;
        vm.prank(buyer);
        loc.cancelLC(id);
        assertEq(buyer.balance, before + amount);
        assertEq(address(loc).balance, 0);
    }
}

/// Seller contract that rejects payment — proves settlement is atomic.
contract RejectingSeller is IERC721Receiver {
    LetterOfCredit immutable loc;

    constructor(LetterOfCredit _loc) {
        loc = _loc;
    }

    function settle(uint256 id) external {
        loc.markDelivered(id);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    // no receive() — the POL transfer to this contract fails
}

/// Buyer contract that rejects its own refund — covers cancelLC's TransferFailed path.
contract RejectingBuyer {
    LetterOfCredit immutable loc;

    constructor(LetterOfCredit _loc) {
        loc = _loc;
    }

    function open(address seller, uint256 amount) external returns (uint256) {
        return loc.openLC{value: amount}(seller, "bad buyer");
    }

    function cancel(uint256 id) external {
        loc.cancelLC(id);
    }

    // no receive() — the refund fails
}

/// Seller contract that re-enters markDelivered on payout.
contract ReentrantSeller is IERC721Receiver {
    LetterOfCredit immutable loc;
    uint256 targetId;
    bool public reentryBlocked;

    constructor(LetterOfCredit _loc) {
        loc = _loc;
    }

    function attack(uint256 id) external {
        targetId = id;
        loc.markDelivered(id);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {
        // try to re-enter and drain via the same (or any) LC
        try loc.markDelivered(targetId) {
            // should never succeed
        } catch {
            reentryBlocked = true;
        }
    }
}
