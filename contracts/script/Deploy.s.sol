// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {LetterOfCredit} from "../src/LetterOfCredit.sol";

/// Deploy to Amoy:
///   forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify
/// Requires PRIVATE_KEY in env (throwaway hackathon key), AMOY_RPC_URL,
/// POLYGONSCAN_API_KEY (see foundry.toml).
contract Deploy is Script {
    function run() external returns (LetterOfCredit loc) {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        loc = new LetterOfCredit();
        vm.stopBroadcast();
        console.log("LetterOfCredit deployed at:", address(loc));
    }
}
