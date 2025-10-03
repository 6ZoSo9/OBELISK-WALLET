// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {DualRewardStaking} from "../src/DualRewardStaking.sol";
interface IERC20 { }
contract DeployDual is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address XENO = vm.envAddress("XENO");
        address DEAD = vm.envAddress("DEAD");
        uint256 RX = vm.envUint("R_X_PER_SEC");
        uint256 RD = vm.envUint("R_D_PER_SEC");
        vm.startBroadcast(pk);
        DualRewardStaking staking = new DualRewardStaking(msg.sender, IERC20(XENO), IERC20(XENO), IERC20(DEAD), RX, RD);
        console2.logAddress(address(staking));
        vm.stopBroadcast();
    }
}
