// import {ethers} from "hardhat";
// import {expect} from "chai";
// import {PermitTransferFrom} from "@uniswap/permit2-sdk";
import PermitTransferFrom from "@uniswap/permit2-sdk";
import SignatureTransfer from "@uniswap/permit2-sdk";
import ethers from "ethers";

// Set up the private key
const privateKey = "0x";
const nodeUrl = "https://rpc.testnet.mantle.xyz";

const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
const signer = new ethers.Wallet(privateKey, provider);

async function getCurrentBlockNumber() {
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
}

getCurrentBlockNumber();

async function getSignature() {
    const permit2Abi = '[{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"AllowanceExpired","type":"error"},{"inputs":[],"name":"ExcessiveInvalidation","type":"error"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"uint256","name":"maxAmount","type":"uint256"}],"name":"InvalidAmount","type":"error"},{"inputs":[],"name":"InvalidContractSignature","type":"error"},{"inputs":[],"name":"InvalidNonce","type":"error"},{"inputs":[],"name":"InvalidSignature","type":"error"},{"inputs":[],"name":"InvalidSignatureLength","type":"error"},{"inputs":[],"name":"InvalidSigner","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[{"internalType":"uint256","name":"signatureDeadline","type":"uint256"}],"name":"SignatureExpired","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"spender","type":"address"}],"name":"Lockdown","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint48","name":"newNonce","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"oldNonce","type":"uint48"}],"name":"NonceInvalidation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"nonce","type":"uint48"}],"name":"Permit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"word","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mask","type":"uint256"}],"name":"UnorderedNonceInvalidation","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint48","name":"newNonce","type":"uint48"}],"name":"invalidateNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wordPos","type":"uint256"},{"internalType":"uint256","name":"mask","type":"uint256"}],"name":"invalidateUnorderedNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"internalType":"struct IAllowanceTransfer.TokenSpenderPair[]","name":"approvals","type":"tuple[]"}],"name":"lockdown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"nonceBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails[]","name":"details","type":"tuple[]"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitBatch","name":"permitBatch","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"internalType":"struct IAllowanceTransfer.AllowanceTransferDetails[]","name":"transferDetails","type":"tuple[]"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]';


    const chainId = (await provider.getNetwork()).chainId;
    console.log("chain id", chainId);

    const permit = new ethers.Contract(permitContract, permit2Abi, signer);


    //Not working
    var nonce = (await permit.allowance(signer.address, tokenAddress, insuranceContract)).expiration;

    //Get random nonce
    nonce = Math.floor(Math.random() * 1001);

    // var nonce = 10;
    const deadline = Math.floor(Date.now() / 1000) + 10000000;
    console.log('deadline', deadline);

    console.log('Nonce', nonce);
    const message = {
        permitted: {
            token: tokenAddress,
            amount: premiumAmount,
        },
        nonce,
        deadline: deadline,
    };

    const { domain, types, values } = SignatureTransfer.SignatureTransfer.getPermitData(
        { ...message, spender: insuranceContract },
        permitContract,
        chainId
    );
    const signature = await signer._signTypedData(domain, types, values);

    console.log("Signature:", signature);
    return {"sig":signature, "nonce": nonce, "deadline":deadline};
}

const permitContract = "0x08B4434924801AC9C0B1a65D21562f2964b0787B"; //0x9345915e2f1d0105695Dd4689774B5f44f67A787
const insuranceContract = "0xebE4C3052624a9909b1F5E8EAD080155dcDffdb1";//"0x35a3a5ed7eEdbdE2Ae8BE83687559564e5Df837f";
const tokenAddress = "0xc0A7F1B0c9988FbC123f688a521387A51596da47";
const premiumAmount = 750;//ethers.utils.parseEther("100");
var signatureData = await getSignature(permitContract, insuranceContract, tokenAddress, premiumAmount);
console.log(signatureData)
