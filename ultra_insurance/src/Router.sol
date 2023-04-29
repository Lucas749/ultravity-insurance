pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Minimal Permit2 interface, derived from
// https://github.com/Uniswap/permit2/blob/main/src/interfaces/ISignatureTransfer.sol
interface IPermit2 {
    // Token and amount in a permit message.
    struct TokenPermissions {
        // Token to transfer.
        IERC20 token;
        // Amount to transfer.
        uint256 amount;
    }

    // The permit2 message.
    struct PermitTransferFrom {
        // Permitted token and amount.
        TokenPermissions permitted;
        // Unique identifier for this permit.
        uint256 nonce;
        // Expiration for this permit.
        uint256 deadline;
    }

    // Transfer details for permitTransferFrom().
    struct SignatureTransferDetails {
        // Recipient of tokens.
        address to;
        // Amount to transfer.
        uint256 requestedAmount;
    }

    // Consume a permit2 message and transfer tokens.
    function permitTransferFrom(
        PermitTransferFrom calldata permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;
}

interface IPools {
    function insure(uint256 ultravityScore, uint256 deviationThreshold, uint256 premium) external;

    function payClaim(
        uint256 ultravityScore,
        uint256 deviationThreshold,
        uint256 claimAmount,
        address recipient
    ) external;

    function refundInsurance(
        uint256 ultravityScore,
        uint256 deviationThreshold,
        uint256 premium,
        address recipient
    ) external;
}

contract InsurancePlatform {
    using SafeERC20 for IERC20;

    IERC20 public usdcToken;
    address public owner;
    address public poolAddress;
    uint256 public blockThreshold;
    uint256 public insuranceCounter;
    IPermit2 public immutable PERMIT2;

    struct Insurance {
        uint256 coverAmount;
        uint256 premiumAmount;
        uint256 deviationThreshold;
        uint256 ultravityRiskScore;
        bytes txCallData;
        address caller;
        address to;
        uint256 blockNumber;
        bool claimable;
        bool claimed;
        bool refunded;
    }

    mapping(uint256 => Insurance) public insurances;

    event InsuranceCreated(uint256 indexed insuranceID);
    event InsuranceClaimed(uint256 indexed insuranceID);
    event InsuranceRefunded(uint256 indexed insuranceID);
    event InsuranceMadeClaimable(uint256 indexed insuranceID);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address usdcAddress, uint256 _blockThreshold, IPermit2 _permit, address _poolAddress) {
        usdcToken = IERC20(usdcAddress);
        poolAddress = _poolAddress;
        owner = msg.sender;
        blockThreshold = _blockThreshold;
        insuranceCounter = 0;
        PERMIT2 = _permit;
    }

    function approveUSDC() public {
        // Approve the poolAddress to transfer USDC on behalf of this contract
        uint256 maxApproval = type(uint256).max;
        usdcToken.approve(poolAddress, maxApproval);
    }

    function createInsurance(
        uint256 coverAmount,
        uint256 deviationThreshold,
        uint256 ultravityRiskScore,
        bytes memory txCallData,
        address caller,
        address to,
        uint256 simBlockNumber,
        // uint256 premiumAmount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) public onlyOwner {
        require(block.number - simBlockNumber <= blockThreshold, "Block threshold exceeded");

        uint256 insuranceID = insuranceCounter++;

        // Implement contract
        uint256 premiumRate = 100; // 1% premium rate (100 basis points);//getPremiumRate(coverAmount, deviationThreshold,ultravityRiskScore);
        uint256 premiumAmount = (coverAmount * premiumRate) / 10000;

        insurances[insuranceID] = Insurance(
            coverAmount,
            premiumAmount,
            deviationThreshold,
            ultravityRiskScore,
            txCallData,
            caller,
            to,
            simBlockNumber,
            false,
            false,
            false
        );

        //Use permit2 to transfer USDC from caller to contract
        // usdcToken.safeTransferFrom(caller, owner, premiumAmount);
        PERMIT2.permitTransferFrom(
            IPermit2.PermitTransferFrom({
                permitted: IPermit2.TokenPermissions({
                    token: usdcToken,
                    amount: premiumAmount
                }),
                nonce: nonce,
                deadline: deadline
            }),
            IPermit2.SignatureTransferDetails({
                to: owner,
                requestedAmount: premiumAmount
            }),
            caller,
            signature
        );

        //Call insure function on the pooling contract to change balances
        IPools(poolAddress).insure(ultravityRiskScore, deviationThreshold, premiumAmount);

        emit InsuranceCreated(insuranceID);
    }

    function makeInsuranceClaimable(uint256 insuranceID) public onlyOwner {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.claimable, "Insurance already claimable");
        insurance.claimable = true;

        emit InsuranceMadeClaimable(insuranceID);
    }

    function refundInsurance(uint256 insuranceID) public {
        Insurance storage insurance = insurances[insuranceID];
        require(isRefundable(insuranceID), "Insurance not refundable");
        require(msg.sender == insurance.caller, "Only the insured caller can refund");

        insurance.refunded = true;
        //Call refund function on the pooling contract to change balances
        IPools(poolAddress).refundInsurance(insurance.ultravityRiskScore, insurance.deviationThreshold, insurance.premiumAmount, insurance.caller);

        emit InsuranceRefunded(insuranceID);
    }

    function claimInsurance(uint256 insuranceID) public {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.claimed, "Insurance already claimed");
        require(!insurance.refunded, "Insurance already refunded");
        require(insurance.claimable, "Insurance not marked as claimable");
        require(msg.sender == insurance.caller, "Only the insured caller can claim");

        insurance.claimed = true;
 
        //Call payClaim function on the pooling contract to change balances
        IPools(poolAddress).payClaim(insurance.ultravityRiskScore, insurance.deviationThreshold, insurance.coverAmount, insurance.caller);

        emit InsuranceClaimed(insuranceID);
    }

    function isRefundable(uint256 insuranceID) public view returns (bool) {
        Insurance storage insurance = insurances[insuranceID];
        return !insurance.refunded && !insurance.claimed && !insurance.claimable;
    }

    //Setter functions
    function setUsdcToken(address usdcAddress) public onlyOwner {
        usdcToken = IERC20(usdcAddress);
    }

    function setPoolAddress(address _poolAddress) public onlyOwner {
        poolAddress = _poolAddress;
    }
    function setOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function setBlockThreshold(uint256 newBlockThreshold) public onlyOwner {
        blockThreshold = newBlockThreshold;
    }
}



// //RPC commands
// forge create --rpc-url https://goerli.infura.io/v3/4f2b1c9453fe4700ab8841e8e1e18ba9 --verify --etherscan-api-key WBAYZPI69Q62A2XGWX493WYIDX59744JKB --gas-price 130 --priority-gas-price 2 --gas-limit 1400000 --private-key 3a89e041321643b38ad0716e546ce1eed0de048827ecc34e22ef9a154c4c53d4 src/Router.sol:InsurancePlatform --constructor-args 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C 3 0x000000000022d473030f116ddee9f6b43ac78ba3 0x000000000022d473030f116ddee9f6b43ac78ba3

// forge create --rpc-url https://goerli.infura.io/v3/ --private-key 3a89e041321643b38ad0716e546ce1eed0de048827ecc34e22ef9a154c4c53d4 src/Pools.sol:Pools --constructor-args
// 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C 3 0x000000000022d473030f116ddee9f6b43ac78ba3 address poolAddress

