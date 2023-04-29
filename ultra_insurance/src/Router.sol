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
    function insure(
        uint256 ultravityScore,
        uint256 deviationThreshold,
        uint256 premium
    ) external;

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

    function getPremiumRate(uint256 ultravityScore, uint256 deviationThreshold) external view returns (uint256);
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
        bool refundable;
        bool claimed;
        bool refunded;
    }

    mapping(uint256 => Insurance) public insurances;

    event InsuranceCreated(uint256 indexed insuranceID);
    event InsuranceClaimed(uint256 indexed insuranceID);
    event InsuranceRefunded(uint256 indexed insuranceID);
    event InsuranceMadeClaimable(uint256 indexed insuranceID);
    event InsuranceMadeRefundable(uint256 indexed insuranceID);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(
        address usdcAddress,
        uint256 _blockThreshold,
        IPermit2 _permit,
        address _poolAddress
    ) {
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

    //Insure transaction
    function createInsurance(
        uint256 insuranceID,
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
    ) public onlyOwner payable{
        require(
            block.number - simBlockNumber <= blockThreshold,
            "Block threshold exceeded"
        );

        uint256 insuranceID = insuranceCounter++;

        // Implement contract
        uint256 premiumRate = getPremiumRate(ultravityRiskScore, deviationThreshold);
        uint256 premiumAmount = (coverAmount * premiumRate) / 10000;

        insurances[insuranceID] = Insurance(
            insuranceID,
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
            false,
            false
        );

        //Use permit2 to transfer USDC from caller to contract
        // usdcToken.safeTransferFrom(caller, address(this), premiumAmount);
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
                to: address(this),
                requestedAmount: premiumAmount
            }),
            caller,
            signature
        );

        //Call insure function on the pooling contract to change balances
        IPools(poolAddress).insure(
            ultravityRiskScore,
            deviationThreshold,
            premiumAmount
        );

        emit InsuranceCreated(insuranceID);
    }

    function transferTest(address caller, uint256 premiumAmount) public{
        usdcToken.safeTransferFrom(caller, address(this), premiumAmount);
    }

    // TO DELETE TESTING PERMIT2
    function testTransfer(
        address caller,
        address to,
        IERC20 token,
        uint256 premiumAmount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) public {
        // Use permit2 to transfer USDC from caller to contract
        PERMIT2.permitTransferFrom(
            IPermit2.PermitTransferFrom({
                permitted: IPermit2.TokenPermissions({
                    token: token,
                    amount: premiumAmount
                }),
                nonce: nonce,
                deadline: deadline
            }),
            IPermit2.SignatureTransferDetails({
                to: to,
                requestedAmount: premiumAmount
            }),
            caller,
            signature
        );
    }

    //Insurance handling logic
    function makeInsuranceClaimable(uint256 insuranceID) public onlyOwner {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.claimable, "Insurance already claimable");
        insurance.claimable = true;

        emit InsuranceMadeClaimable(insuranceID);
    }

    function makeInsuranceRefundable(uint256 insuranceID) public onlyOwner {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.refunded, "Insurance already refunded");
        insurance.refundable = true;

        emit InsuranceMadeRefundable(insuranceID);
    }

    //Claim
    function isClaimable(uint256 insuranceID)  public view returns (bool) {
        Insurance storage insurance = insurances[insuranceID];
        return insurance.claimable;
    }

    function claimInsurance(uint256 insuranceID) public {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.claimed, "Insurance already claimed");
        require(!insurance.refunded, "Insurance already refunded");
        require(insurance.claimable, "Insurance not marked as claimable");
        require(
            msg.sender == insurance.caller,
            "Only the insured caller can claim"
        );

        insurance.claimed = true;

        //Call payClaim function on the pooling contract to change balances
        IPools(poolAddress).payClaim(
            insurance.ultravityRiskScore,
            insurance.deviationThreshold,
            insurance.coverAmount,
            insurance.caller
        );

        emit InsuranceClaimed(insuranceID);
    }
    //Refund
    function isRefundable(uint256 insuranceID) public view returns (bool) {
        Insurance storage insurance = insurances[insuranceID];
        return insurance.refundable;
    }

    function refundInsurance(uint256 insuranceID) public {
        Insurance storage insurance = insurances[insuranceID];
        require(isRefundable(insuranceID), "Insurance not refundable");
        require(
            msg.sender == insurance.caller,
            "Only the insured caller can refunded"
        );

        insurance.refunded = true;
        //Call refund function on the pooling contract to change balances
        IPools(poolAddress).refundInsurance(
            insurance.ultravityRiskScore,
            insurance.deviationThreshold,
            insurance.premiumAmount,
            insurance.caller
        );

        emit InsuranceRefunded(insuranceID);
    }

    //Getter functions
    function getPremiumRate(
        uint256 ultravityScore,
        uint256 deviationThreshold
    ) public view returns (uint256) {
        return IPools(poolAddress).getPremiumRate(ultravityScore, deviationThreshold);
    }


    function getPremiumAmount(
        uint256 ultravityScore,
        uint256 deviationThreshold,
        uint256 coverAmount
    ) public view returns (uint256) {
        uint256 premiumRate = getPremiumRate(ultravityScore, deviationThreshold);
        uint256 premiumAmount = (coverAmount * premiumRate) / 10000;
        return premiumAmount;
    }

    function getUserInsurances(
        address user
    ) public view returns (Insurance[] memory) {
        uint256 userInsuranceCount = 0;

        // Count the number of insurances for the user
        for (uint256 i = 0; i < insuranceCounter; i++) {
            if (insurances[i].caller == user) {
                userInsuranceCount++;
            }
        }

        Insurance[] memory userInsurances = new Insurance[](userInsuranceCount);
        uint256 index = 0;

        // Populate the array with the user's insurances
        for (uint256 i = 0; i < insuranceCounter; i++) {
            if (insurances[i].caller == user) {
                userInsurances[index] = insurances[i];
                index++;
            }
        }

        return userInsurances;
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