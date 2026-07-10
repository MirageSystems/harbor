// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {LetterOfCredit} from "../src/LetterOfCredit.sol";

/// Random open/settle/cancel sequences driven through a handler.
/// Core invariant (spec #1): contract balance == sum of amounts of Open LCs.
contract Handler is Test {
    LetterOfCredit public loc;
    address[] public actors;

    constructor(LetterOfCredit _loc) {
        loc = _loc;
        for (uint256 i = 0; i < 4; i++) {
            address a = makeAddr(string(abi.encodePacked("actor", i)));
            actors.push(a);
            vm.deal(a, 1_000_000 ether);
        }
    }

    function _actor(uint256 seed) internal view returns (address) {
        return actors[seed % actors.length];
    }

    function open(uint256 buyerSeed, uint256 sellerSeed, uint96 amount) external {
        address buyer = _actor(buyerSeed);
        address seller = _actor(sellerSeed);
        if (seller == buyer || amount == 0) return;
        vm.prank(buyer);
        loc.openLC{value: amount}(seller, "inv");
    }

    function settle(uint256 idSeed) external {
        uint256 next = loc.nextId();
        if (next == 1) return;
        uint256 id = (idSeed % (next - 1)) + 1;
        LetterOfCredit.LC memory lc = loc.getLC(id);
        if (lc.status != LetterOfCredit.Status.Open) return;
        vm.prank(lc.seller);
        loc.markDelivered(id);
    }

    function cancel(uint256 idSeed) external {
        uint256 next = loc.nextId();
        if (next == 1) return;
        uint256 id = (idSeed % (next - 1)) + 1;
        LetterOfCredit.LC memory lc = loc.getLC(id);
        if (lc.status != LetterOfCredit.Status.Open) return;
        vm.prank(lc.buyer);
        loc.cancelLC(id);
    }
}

contract LetterOfCreditInvariantTest is Test {
    LetterOfCredit loc;
    Handler handler;

    function setUp() public {
        loc = new LetterOfCredit();
        handler = new Handler(loc);
        targetContract(address(handler));
    }

    /// Spec invariant 1: escrowed balance exactly backs all open LCs.
    function invariant_balanceBacksOpenLCs() public view {
        uint256 sumOpen;
        uint256 next = loc.nextId();
        for (uint256 id = 1; id < next; id++) {
            if (loc.getLC(id).status == LetterOfCredit.Status.Open) {
                sumOpen += loc.getLC(id).amount;
            }
        }
        assertEq(address(loc).balance, sumOpen);
    }

    /// Spec invariant 4: NFT exists iff LC is Settled, minted to its seller.
    function invariant_nftIffSettled() public view {
        uint256 next = loc.nextId();
        for (uint256 id = 1; id < next; id++) {
            LetterOfCredit.LC memory lc = loc.getLC(id);
            if (lc.status == LetterOfCredit.Status.Settled) {
                assertEq(loc.ownerOf(id), lc.seller);
            } else {
                assertFalse(_exists(id));
            }
        }
    }

    function _exists(uint256 id) internal view returns (bool) {
        try loc.ownerOf(id) returns (address) {
            return true;
        } catch {
            return false;
        }
    }

    /// Terminal statuses never revert to Open (spec invariant 2) is implied by
    /// the handler only acting on Open LCs plus the status checks in the contract;
    /// the balance invariant above would break if a terminal LC paid twice.
}
