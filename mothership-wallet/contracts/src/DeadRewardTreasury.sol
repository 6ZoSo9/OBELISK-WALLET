// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {SafeERC20} from "openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @dev Simple treasury that holds DEAD and streams it by approving the staking contract.
 * In production, gate this via vesting and/or merkle-bridged roots to Dead Chain.
 */
contract DeadRewardTreasury is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable DEAD;
    constructor(address owner_, IERC20 dead) Ownable(owner_) { DEAD=dead; }
    function fund(address to, uint256 amount) external onlyOwner { DEAD.safeTransfer(to, amount); }
    function approve(address spender, uint256 amount) external onlyOwner { DEAD.approve(spender, amount); }
}
