pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UltravityRouter {
    using SafeERC20 for IERC20;

    IERC20 public usdcToken;
    address public owner;
    uint256 public blockThreshold;

    struct Insurance {
        uint256 coverAmount;
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

    mapping(bytes32 => Insurance) public insurances;

    event InsuranceCreated(bytes32 indexed insuranceID);
    event InsuranceClaimed(bytes32 indexed insuranceID);
    event InsuranceRefunded(bytes32 indexed insuranceID);
    event InsuranceMadeClaimable(bytes32 indexed insuranceID);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address usdcAddress, uint256 _blockThreshold) {
        usdcToken = IERC20(usdcAddress);
        owner = msg.sender;
        blockThreshold = _blockThreshold;
    }

    function createInsurance(
        uint256 coverAmount,
        uint256 deviationThreshold,
        uint256 ultravityRiskScore,
        bytes memory txCallData,
        address caller,
        address to,
        uint256 blockNumber,
        uint256 premiumAmount
    ) public onlyOwner {
        require(block.number - blockNumber <= blockThreshold, "Block threshold exceeded");

        bytes32 insuranceID = keccak256(abi.encodePacked(txCallData, caller));

        insurances[insuranceID] = Insurance(
            coverAmount,
            deviationThreshold,
            ultravityRiskScore,
            txCallData,
            caller,
            to,
            blockNumber,
            false,
            false,
            false
        );

        usdcToken.safeTransferFrom(caller, owner, premiumAmount);

        emit InsuranceCreated(insuranceID);
    }

    function makeInsuranceClaimable(bytes32 insuranceID) public onlyOwner {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.claimable, "Insurance already claimable");
        insurance.claimable = true;

        emit InsuranceMadeClaimable(insuranceID);
    }

    function refundInsurance(bytes32 insuranceID) public {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.refunded, "Insurance already refunded");
        require(!insurance.claimed, "Insurance already claimed");
        require(msg.sender == insurance.caller, "Only the insured caller can refund");

        insurance.refunded = true;
        usdcToken.safeTransfer(msg.sender, insurance.coverAmount);

        emit InsuranceRefunded(insuranceID);
    }

    function claimInsurance(bytes32 insuranceID) public {
        Insurance storage insurance = insurances[insuranceID];
        require(!insurance.claimed, "Insurance already claimed");
        require(!insurance.refunded, "Insurance already refunded");
        require(insurance.claimable, "Insurance not marked as claimable");
        require(msg.sender == insurance.caller, "Only the insured caller can claim");

        insurance.claimed = true;
        usdcToken.safeTransfer(msg.sender, insurance.coverAmount);

        emit InsuranceClaimed(insuranceID);
    }
}
