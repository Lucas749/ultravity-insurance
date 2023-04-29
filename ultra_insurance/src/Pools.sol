// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Pools {
    using SafeERC20 for IERC20;

    address public owner;
    address public router;
    IERC20 public stakingToken;

    struct Pool {
        uint256 baseRate;
        uint256 minPremium;
        uint256 deviationThreshold;
        uint256 score;
        uint256 totalStaked;
        uint256 totalValue;
    }
    struct UserStake {
        uint8 scoreBucket;
        uint8 deviationBucket;
        uint256 stakedAmount;
    }


    mapping(uint8 => mapping(uint8 => Pool)) public pools;
    mapping(address => mapping(uint8 => mapping(uint8 => uint256))) public stakedAmountsByUser;


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "Only router can call this function");
        _;
    }
    function changeOwner(address newOwner) onlyOwner external {
        owner = newOwner;
    }

    constructor(IERC20 _stakingToken, address _router) {
        owner = msg.sender;
        router = _router;

        stakingToken = _stakingToken;
    }

    function stake(uint256 amount, uint8 scoreBucket, uint8 deviationBucket) external {
        Pool storage pool = pools[scoreBucket][deviationBucket];
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        stakedAmountsByUser[msg.sender][scoreBucket][deviationBucket] += amount;
        
        pool.totalStaked += amount;
        pool.totalValue += amount;
    }

    function withdraw(uint256 amount, uint8 scoreBucket, uint8 deviationBucket) external {
        require(stakedAmountsByUser[msg.sender][scoreBucket][deviationBucket] >= amount, "Not enough balance to withdraw");
        Pool storage pool = pools[scoreBucket][deviationBucket];
        
        
        stakedAmountsByUser[msg.sender][scoreBucket][deviationBucket] -= amount;
        uint256 percHolding = (amount) / pool.totalStaked;
        pool.totalStaked -= amount;
        
        uint256 transferAmount = pool.totalValue * percHolding;
        pool.totalValue -= transferAmount;
        stakingToken.safeTransfer(msg.sender, transferAmount);
    }

    function insure(uint256 ultravityScore, uint256 deviationThreshold, uint256 premium) external onlyRouter {
        (uint8 scoreBucket, uint8 deviationBucket) = getPoolIndex(ultravityScore, deviationThreshold);
        
        Pool storage pool = pools[scoreBucket][deviationBucket];
        stakingToken.safeTransferFrom(msg.sender, address(this), premium);
        pool.totalValue += premium;
    }

    function payClaim(uint256 ultravityScore, uint256 deviationThreshold, uint256 claimAmount, address recipient) external onlyRouter {
        (uint8 scoreBucket, uint8 deviationBucket) = getPoolIndex(ultravityScore, deviationThreshold);
        
        Pool storage pool = pools[scoreBucket][deviationBucket];
        
        require(pool.totalValue >= claimAmount, "Not enough funds in the pool to cover the claim");
        pool.totalValue -= claimAmount;
        stakingToken.safeTransfer(recipient, claimAmount);
    }
    
    function refundInsurance(uint256 ultravityScore, uint256 deviationThreshold, uint256 premium, address recipient) external onlyRouter {
        (uint8 scoreBucket, uint8 deviationBucket) = getPoolIndex(ultravityScore, deviationThreshold);
        
        Pool storage pool = pools[scoreBucket][deviationBucket];
        
        require(pool.totalValue >= premium, "Not enough funds in the pool to refund the insurance");
        pool.totalValue -= premium;
        stakingToken.safeTransfer(recipient, premium);
    }
    
    function getPremiumRate(uint256 ultravityScore, uint256 deviationThreshold) external view returns (uint256){
        (uint8 scoreBucket, uint8 deviationBucket) = getPoolIndex(ultravityScore, deviationThreshold);
        
        Pool storage pool = pools[scoreBucket][deviationBucket];
        
        return pool.baseRate;
    }

    function getPool(uint256 ultravityScore, uint256 deviationThreshold) external view returns (Pool memory) {
        uint8 scoreIndex;
        uint8 thresholdIndex;

        if (ultravityScore < 50) {
            scoreIndex = 0;
        } else if (ultravityScore < 80) {
            scoreIndex = 1;
        } else {
            scoreIndex = 2;
        }

        if (deviationThreshold <= 2) {
            thresholdIndex = 0;
        } else if (deviationThreshold <= 5) {
            thresholdIndex = 1;
        } else {
            thresholdIndex = 2;
        }

        return pools[scoreIndex][thresholdIndex];
    }

    function getPoolIndex(uint256 ultravityScore, uint256 deviationThreshold)  public view returns (uint8,uint8) {
        uint8 scoreIndex;
        uint8 thresholdIndex;

        if (ultravityScore < 50) {
            scoreIndex = 0;
        } else if (ultravityScore < 80) {
            scoreIndex = 1;
        } else {
            scoreIndex = 2;
        }

        if (deviationThreshold <= 2) {
            thresholdIndex = 0;
        } else if (deviationThreshold <= 5) {
            thresholdIndex = 1;
        } else {
            thresholdIndex = 2;
        }

        return (scoreIndex, thresholdIndex);
    }

    function getUserStakes(address user) external view returns (UserStake[] memory) {
        UserStake[] memory userStakesArray = new UserStake[](9);
        uint256 count = 0;

        for (uint8 scoreBucket = 0; scoreBucket < 3; scoreBucket++) {
            for (uint8 deviationBucket = 0; deviationBucket < 3; deviationBucket++) {
                uint256 stakedAmount = stakedAmountsByUser[user][scoreBucket][deviationBucket];

                if (stakedAmount > 0) {
                    userStakesArray[count] = UserStake({
                        scoreBucket: scoreBucket,
                        deviationBucket: deviationBucket,
                        stakedAmount: stakedAmount
                    });

                    count++;
                }
            }
        }

        UserStake[] memory filteredUserStakes = new UserStake[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredUserStakes[i] = userStakesArray[i];
        }

        return filteredUserStakes;
    }

    function setPool(uint256 ultravityScore, uint256 deviationThreshold, uint256 baseRate, uint256 minPremium) external onlyOwner {
        (uint8 scoreBucket, uint8 deviationBucket) = getPoolIndex(ultravityScore, deviationThreshold);
        
        pools[scoreBucket][deviationBucket] = Pool({
            baseRate: baseRate,
            minPremium: minPremium,
            deviationThreshold: deviationBucket,
            score: scoreBucket,
            totalStaked: 0,
            totalValue: 0
        });
    }

    function setRouter(address _router) public onlyOwner {
        router = _router;
    }

    function setStakingToken(IERC20 _stakingToken) public onlyOwner {
        stakingToken = _stakingToken;
    }
}
