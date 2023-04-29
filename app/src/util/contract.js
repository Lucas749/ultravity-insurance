import { ethers } from "ethers";

const staking_token_address = "0xc0A7F1B0c9988FbC123f688a521387A51596da47"
const pooling_contract_address = "0x71C2468664b8c0c7d0ad0eA59C1fc1ddA15CDA7c"

const ERC20_abi = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

const abi =  [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"},{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeOwner","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct Pools.Pool","components":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}]}],"name":"getPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}],"name":"getPoolIndex","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPremiumRate","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Pools.UserStake[]","components":[{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"},{"type":"uint256","name":"stakedAmount","internalType":"uint256"}]}],"name":"getUserStakes","inputs":[{"type":"address","name":"user","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"insure","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"payClaim","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"claimAmount","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}],"name":"pools","inputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"refundInsurance","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"router","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRouter","inputs":[{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setStakingToken","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmountsByUser","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stakingToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]}]
//erc 20 abi 
// wbit token address

const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.testnet.mantle.xyz"
  );

  const approvingContract = new ethers.Contract(staking_token_address, ERC20_abi, provider )
  const signingContract = new ethers.Contract(pooling_contract_address, abi, provider);
  
    //Approving (token address, token_abi, provider)
  //Signing (pooling contract adddress, pooling, mantle)

export { abi, approvingContract, signingContract };