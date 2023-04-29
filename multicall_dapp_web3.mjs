//Import packages
import {  Multicall} from 'ethereum-multicall';
import Web3 from 'web3';

// Define network addresses for multicall for mantle and scroll networks
const MANTLE_NETWORK_MULTICALL_CONTRACT_ADDRESS = '0x410e601895F17857e8ddCBc2eFd6B4aa0FDB3c60';

//Returns multicall object
async function get_multi_call_provider(rpc_url){
   //Set provider to Tenderly :)
   const web3 = new Web3(rpc_url);
 
   // Get chain id
   const chain_id = await web3.eth.getChainId();
 
   //Mantle network
   if (chain_id == 5001){
     var multicall = new Multicall({
       web3Instance: web3,
       tryAggregate: true,
       multicallCustomContractAddress: MANTLE_NETWORK_MULTICALL_CONTRACT_ADDRESS,
     });
     
   }else{
     // Create a new Multicall instance
     var multicall = new Multicall({
       web3Instance: web3,
       tryAggregate: true,
     });
   }
   
   return multicall;
}
// Returns prediction market details
async function get_prediction_market_details(rpc_url, contract_address, abi, prediction_id) {
  // Get multicall object
  var multicall = await get_multi_call_provider(rpc_url);
  
  // Define the calls
  const contractCallContext = [
      {
          reference: 'contract',
          contractAddress: contract_address,
          abi: abi,
          calls: [
            // { reference: 'getLivePredictionIds', methodName: 'getLivePredictionIds', methodParameters: []},
            // { reference: 'predictionMarkets', methodName: 'predictionMarkets', methodParameters: [prediction_id] },
            { reference: 'predictionMarkets', methodName: 'viewPrediction', methodParameters: [prediction_id] },
            // { reference: 'getCurrentPrediction', methodName: 'getCurrentPrediction', methodParameters: [prediction_id] },
            // { reference: 'owner', methodName: 'owner', methodParameters: [] },
            // { reference: 'totalPredictions', methodName: 'totalPredictions', methodParameters: [] },
          ]
    },
  ];

  // Execute all calls in a single multicall
  const results = await multicall.call(contractCallContext);
  
  // Unpack all individual results
  var all_res = results.results.contract.callsReturnContext;
  var results_dict = {};
  for (const res of all_res) {
    var key = res['reference'];
    results_dict[key] = res['returnValues'];
  }

  // Requested variables
  var req_variables = {};
  req_variables['prediction_title'] = results_dict['predictionMarkets'][0];
  req_variables['unit'] = results_dict['predictionMarkets'][1];
  req_variables['prediction_bucket'] = results_dict['predictionMarkets'][2];
  req_variables['reward_amount'] = results_dict['predictionMarkets'][3];
  req_variables['reward_token'] = results_dict['predictionMarkets'][4];
  req_variables['permissioned_tags'] = results_dict['predictionMarkets'][5];
  req_variables['permissioned'] = results_dict['predictionMarkets'][6];
  req_variables['deadline'] = results_dict['predictionMarkets'][7];
  req_variables['tags'] = results_dict['predictionMarkets'][8][0];
  req_variables['picture_url'] = results_dict['predictionMarkets'][8][2];
  req_variables['prediction_id'] = results_dict['predictionMarkets'][9];
  req_variables['creator_address'] = results_dict['predictionMarkets'][10];
  req_variables['outcome'] = results_dict['predictionMarkets'][11];
  req_variables['committed_amount_bucket'] = results_dict['predictionMarkets'][12];

  try{
    req_variables['current_prediction'] = results_dict['getCurrentPrediction'][0];
  }catch{
    req_variables['current_prediction'] = null;
  }

  return req_variables;
}

// Get claimable amount
async function wbitApproved(rpc_url, contract_address, abi, poolAddress, user) {
	// Get multicall object
	var multicall = await get_multi_call_provider(rpc_url);
	// Define the calls
	const contractCallContext = [
		{
			reference: 'contract',
			contractAddress: contract_address,
			abi: abi,
			calls: [
			  { reference: 'wbitApproved', methodName: 'allowance', methodParameters: [user, poolAddress] },
			]
	  },
	];
  
	// Execute all calls in a single multicall
	const results = await multicall.call(contractCallContext);
	
	// Unpack all individual results
	var all_res = results.results.contract.callsReturnContext;
	var result = all_res[0]['returnValues'][0];
	return parseInt(result.hex,16);
  }
  
// Define the contract variables
const stakingToken = "0xc0A7F1B0c9988FbC123f688a521387A51596da47"
const poolAddress = "0x71C2468664b8c0c7d0ad0eA59C1fc1ddA15CDA7c"
const routerAddress = "XX"
const rpcUrl = "https://rpc.testnet.mantle.xyz"
const user = "0xf2B719136656BF21c2B2a255F586afa34102b71d"
const ERC20Abi = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
const poolAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"},{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeOwner","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct Pools.Pool","components":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}]}],"name":"getPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}],"name":"getPoolIndex","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPremiumRate","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Pools.UserStake[]","components":[{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"},{"type":"uint256","name":"stakedAmount","internalType":"uint256"}]}],"name":"getUserStakes","inputs":[{"type":"address","name":"user","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"insure","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"payClaim","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"claimAmount","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}],"name":"pools","inputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"refundInsurance","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"router","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRouter","inputs":[{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setStakingToken","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmountsByUser","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stakingToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]}]

const stakingAmount = 1000000;
var approvedWbit = await wbitApproved(rpcUrl, stakingToken, ERC20Abi, poolAddress, user);
console.log(approvedWbit);
if (approvedWbit < stakingAmount){
    //DO APPROVE TRANSACTION
    console.log("DO APPROVE TRANSACTION");
}


