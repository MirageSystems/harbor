// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {LetterOfCredit} from "../src/LetterOfCredit.sol";

/// Full demo cycle against a deployed contract — the CLI fallback for the
/// live demo and the reference for frontend wiring:
///   LOC_ADDRESS=0x... BUYER_KEY=0x... SELLER_KEY=0x... \
///   forge script script/DemoCycle.s.sol --rpc-url amoy --broadcast
/// Opens an LC from the buyer, settles it from the seller, logs the ids
/// and balances at each step.
contract DemoCycle is Script {
    function run() external {
        LetterOfCredit loc = LetterOfCredit(vm.envAddress("LOC_ADDRESS"));
        uint256 buyerKey = vm.envUint("BUYER_KEY");
        uint256 sellerKey = vm.envUint("SELLER_KEY");
        address seller = vm.addr(sellerKey);
        uint256 amount = vm.envOr("AMOUNT", uint256(0.01 ether));

        vm.startBroadcast(buyerKey);
        uint256 id = loc.openLC{value: amount}(seller, "PO-2026-0710 Harbor demo");
        vm.stopBroadcast();
        console.log("LC opened, id:", id);

        uint256 before = seller.balance;
        vm.startBroadcast(sellerKey);
        loc.markDelivered(id);
        vm.stopBroadcast();

        console.log("LC settled. Seller received (wei):", seller.balance - before);
        console.log("Receivable NFT owner:", loc.ownerOf(id));
    }
}
