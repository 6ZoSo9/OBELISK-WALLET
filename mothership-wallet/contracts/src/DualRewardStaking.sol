// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

contract DualRewardStaking is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable stakeToken;   // XENO
    IERC20 public immutable rewardXeno;   // XENO reward
    IERC20 public immutable rewardDead;   // DEAD reward
    struct User { uint256 shares; uint256 debtX; uint256 debtD; }
    uint256 public totalStaked;
    uint256 public totalShares;
    uint256 public accXPerShare; // 1e18
    uint256 public accDPerShare; // 1e18
    uint64  public lastUpdate;
    uint256 public rXPerSec;     // XENO/sec
    uint256 public rDPerSec;     // DEAD/sec

    mapping(address=>User) public u;

    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Claimed(address indexed user, uint256 xeno, uint256 dead);

    constructor(address owner_, IERC20 _stake, IERC20 _x, IERC20 _d, uint256 rX, uint256 rD) Ownable(owner_) {
        stakeToken=_stake; rewardXeno=_x; rewardDead=_d; rXPerSec=rX; rDPerSec=rD; lastUpdate=uint64(block.timestamp);
    }
    function setRates(uint256 rX, uint256 rD) external onlyOwner { _update(); rXPerSec=rX; rDPerSec=rD; }

    function _update() internal {
        if (block.timestamp == lastUpdate || totalShares == 0) { lastUpdate = uint64(block.timestamp); return; }
        uint256 dt = block.timestamp - lastUpdate;
        accXPerShare += (rXPerSec * dt * 1e18) / totalShares;
        accDPerShare += (rDPerSec * dt * 1e18) / totalShares;
        lastUpdate = uint64(block.timestamp);
    }

    function deposit(uint256 amount) external {
        _update();
        stakeToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 sh = totalStaked == 0 ? amount : (amount * totalShares) / totalStaked;
        totalStaked += amount; totalShares += sh;
        User storage s = u[msg.sender];
        s.debtX += (sh * accXPerShare)/1e18;
        s.debtD += (sh * accDPerShare)/1e18;
        s.shares += sh;
        emit Deposited(msg.sender, amount, sh);
    }

    function pending(address a) public view returns (uint256 px, uint256 pd) {
        User storage s = u[a];
        uint256 accX = accXPerShare; uint256 accD = accDPerShare;
        if (block.timestamp > lastUpdate && totalShares > 0) {
            uint256 dt = block.timestamp - lastUpdate;
            accX += (rXPerSec * dt * 1e18) / totalShares;
            accD += (rDPerSec * dt * 1e18) / totalShares;
        }
        px = (s.shares * accX)/1e18 - s.debtX;
        pd = (s.shares * accD)/1e18 - s.debtD;
    }

    function claim() external {
        _update();
        User storage s = u[msg.sender];
        uint256 x = (s.shares * accXPerShare)/1e18 - s.debtX;
        uint256 d = (s.shares * accDPerShare)/1e18 - s.debtD;
        if (x > 0) { s.debtX += x; rewardXeno.safeTransfer(msg.sender, x); }
        if (d > 0) { s.debtD += d; rewardDead.safeTransfer(msg.sender, d); }
        emit Claimed(msg.sender, x, d);
    }
}
