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

// Get approved amount
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

// Get premium rate
async function getPremiumRate(rpc_url, contract_address, abi, ultravityScore, deviationThreshold) {
	// Get multicall object
	var multicall = await get_multi_call_provider(rpc_url);
	// Define the calls
	const contractCallContext = [
		{
			reference: 'contract',
			contractAddress: contract_address,
			abi: abi,
			calls: [
			  { reference: 'getPremiumRate', methodName: 'getPremiumRate', methodParameters: [ultravityScore, deviationThreshold] },
			]
	  },
	];
  
	// Execute all calls in a single multicall
	const results = await multicall.call(contractCallContext);
	
	// Unpack all individual results
	var all_res = results.results.contract.callsReturnContext;
	var result = all_res[0]['returnValues'][0];
	return parseInt(result.hex,16) / 10000;
  }

// Get user staked amount for specific pool
async function stakedAmountUserSpecificPool(rpc_url, contract_address, abi, user, scoreIndex, deviationIndex) {
	// Get multicall object
	var multicall = await get_multi_call_provider(rpc_url);
	// Define the calls
	const contractCallContext = [
		{
			reference: 'contract',
			contractAddress: contract_address,
			abi: abi,
			calls: [
			  { reference: 'stakedAmount', methodName: 'stakedAmountsByUser', methodParameters: [user, scoreIndex, deviationIndex] },
			]
	  },
	];
  
	// Execute all calls in a single multicall
	const results = await multicall.call(contractCallContext);
	
	// Unpack all individual results
	var all_res = results.results.contract.callsReturnContext;
	var result = all_res[0]['returnValues'][0];
	return parseInt(result.hex,16) / 1e18;
  }


// Get pool indices
async function getPoolIndices(rpc_url, contract_address, abi, ultravityScore, deviationThreshold) {
	// Get multicall object
	var multicall = await get_multi_call_provider(rpc_url);
	// Define the calls
	const contractCallContext = [
		{
			reference: 'contract',
			contractAddress: contract_address,
			abi: abi,
			calls: [
			  { reference: 'getPoolIndex', methodName: 'getPoolIndex', methodParameters: [ultravityScore, deviationThreshold] },
			]
	  },
	];
  
	// Execute all calls in a single multicall
	const results = await multicall.call(contractCallContext);
	
	// Unpack all individual results
	var all_res = results.results.contract.callsReturnContext;
	var result = all_res[0]['returnValues'];
	return result;
  }

// Get pool information
async function getPoolInfo(rpc_url, contract_address, abi, ultravityScore, deviationThreshold) {
	// Get multicall object
	var multicall = await get_multi_call_provider(rpc_url);
	// Define the calls
	const contractCallContext = [
		{
			reference: 'contract',
			contractAddress: contract_address,
			abi: abi,
			calls: [
			  { reference: 'getPool', methodName: 'getPool', methodParameters: [ultravityScore, deviationThreshold] },
			]
	  },
	];
  
	// Execute all calls in a single multicall
	const results = await multicall.call(contractCallContext);
	
	// Unpack all individual results
	var all_res = results.results.contract.callsReturnContext;
	var result = all_res[0]['returnValues'];


    // Requested variables
    var req_variables = {};
    req_variables['baseRate'] = parseInt(result[0].hex,16) / 10000;
    req_variables['minPremium'] = parseInt(result[1].hex,16);
    req_variables['deviationThreshold'] = parseInt(result[2].hex,16);
    req_variables['score'] = parseInt(result[3].hex,16);
    req_variables['totalStaked'] = parseInt(result[4].hex,16) / 1e18;
    req_variables['totalValue'] = parseInt(result[5].hex,16) / 1e18;
    req_variables['valueAccrual'] = req_variables['totalValue'] / req_variables['totalStaked'] -1;

    return req_variables;
}

// Get all pools user staked
async function getUserStakes(rpc_url, contract_address, abi, user) {
	// Get multicall object
	var multicall = await get_multi_call_provider(rpc_url);
	// Define the calls
	const contractCallContext = [
		{
			reference: 'contract',
			contractAddress: contract_address,
			abi: abi,
			calls: [
			  { reference: 'getUserStakes', methodName: 'getUserStakes', methodParameters: [user] },
			]
	  },
	];
  
	// Execute all calls in a single multicall
	const results = await multicall.call(contractCallContext);
	
	// Unpack all individual results
	var all_res = results.results.contract.callsReturnContext;
	var result = all_res[0]['returnValues'];


    // Requested variables
    var res_list = [];

    for (var i = 0; i < result.length; i++) {
        var req_variables = {};
        req_variables['scoreIndex'] = result[i][0];
        req_variables['deviationIndex'] = result[i][1];
        req_variables['stakedAmount'] = parseInt(result[i][2].hex,16) / 1e18;
        res_list.push(req_variables);
    }

    return res_list;
}

// Returns all live prediction markets
async function getAllPools(rpc_url, contract_address, abi, maxScoreIndex, maxDeviationIndex) {
    // Get multicall object
    var multicall = await get_multi_call_provider(rpc_url);

    // Create call list
    var call_list = []

    for (let i = 0; i <= maxScoreIndex; i++) {
        for (let j = 0; j <= maxDeviationIndex; j++) {
            //Concat request
            call_list.push(
                { reference: 'getPool_' +i.toString()+"_"+j.toString(), methodName: 'pools', methodParameters: [i, j] }
            )
        }
    }

    // Define the call
    const contractCallContext = [
        {
            reference: 'contract',
            contractAddress: contract_address,
            abi: abi,
            calls: call_list
        },
    ];

    // Execute all calls in a single multicall
    var results = await multicall.call(contractCallContext);

    // Unpack all individual results
    var all_res = results.results.contract.callsReturnContext;
    var results_dict = {};
    for (const res of all_res) {
      var key = res['reference'];
      results_dict[key] = res['returnValues'];
    }
  
    // Requested variables
    var req_list = [];
    for (let i = 0; i <= maxScoreIndex; i++) {
        for (let j = 0; j <= maxDeviationIndex; j++) {
            try{
				var dictKey = 'getPool_' +i.toString()+"_"+j.toString();
				var res_dict = results_dict[dictKey];
				var req_variables = {};
				req_variables['scoreIndex'] = i;
				req_variables['deviationIndex'] = j;
				req_variables['baseRate'] = parseInt(res_dict[0].hex,16) / 10000;
				req_variables['minPremium'] = parseInt(res_dict[1].hex,16);
				req_variables['deviationThreshold'] = parseInt(res_dict[2].hex,16);
				req_variables['score'] = parseInt(res_dict[3].hex,16);
				req_variables['totalStaked'] = parseInt(res_dict[4].hex,16) / 1e18;
				req_variables['totalValue'] = parseInt(res_dict[5].hex,16) / 1e18;
				req_variables['valueAccrual'] = req_variables['totalValue'] / req_variables['totalStaked'] -1;
	
	
				req_list.push(req_variables);
			} catch {
				console.log('Error unwrapping');
			}
			
        }
    }
    return req_list;
  }

// Define the contract variables
const stakingToken = "0xc0A7F1B0c9988FbC123f688a521387A51596da47"
const poolAddress = "0x71C2468664b8c0c7d0ad0eA59C1fc1ddA15CDA7c"
const routerAddress = "XX"
const rpcUrl = "https://rpc.testnet.mantle.xyz"
const user = "0xf2B719136656BF21c2B2a255F586afa34102b71d"
const ERC20Abi = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
const poolAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"},{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeOwner","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct Pools.Pool","components":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}]}],"name":"getPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}],"name":"getPoolIndex","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPremiumRate","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Pools.UserStake[]","components":[{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"},{"type":"uint256","name":"stakedAmount","internalType":"uint256"}]}],"name":"getUserStakes","inputs":[{"type":"address","name":"user","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"insure","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"payClaim","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"claimAmount","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}],"name":"pools","inputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"refundInsurance","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"router","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRouter","inputs":[{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setStakingToken","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmountsByUser","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stakingToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]}]

//WBIT Approval
const stakingAmount = 1000000;
var approvedWbit = await wbitApproved(rpcUrl, stakingToken, ERC20Abi, poolAddress, user);
console.log("Approved WBIT for ", user, " ", approvedWbit);
if (approvedWbit < stakingAmount){
    //DO APPROVE TRANSACTION
    console.log("DO APPROVE TRANSACTION");
}

//All Pools
const maxScoreIndex = 2;
const maxDeviationIndex = 2;
var allPools = await getAllPools(rpcUrl, poolAddress, poolAbi, maxScoreIndex, maxDeviationIndex);
console.log('All pools:', allPools);

//All pools user staked
var userStakes = await getUserStakes(rpcUrl, poolAddress, poolAbi, user);
console.log("User ", user, "staked in the following pools: ", userStakes);

//Get pool indices for score and deviation figures
var ultravityScore = 70;
var deviationThreshold = 2;
var indices = await getPoolIndices(rpcUrl, poolAddress, poolAbi, ultravityScore, deviationThreshold);
var scoreIndex = indices[0]
var deviationIndex = indices[1]
console.log("Pool indices for score:", ultravityScore, "and deviation threshold:" ,deviationThreshold, "is ", scoreIndex, deviationIndex);

// //Staked Amount User per Pool
scoreIndex = 0;
deviationIndex = 0;
var stakedAmount = await stakedAmountUserSpecificPool(rpcUrl, poolAddress, poolAbi, user, scoreIndex, deviationIndex);
console.log("User ", user, "staked ", stakedAmount, "in pool ", scoreIndex, deviationIndex);

//Pool Information
var poolInfo = await getPoolInfo(rpcUrl, poolAddress, poolAbi, ultravityScore, deviationThreshold);
console.log(poolInfo);

//Get Premium Rate
ultravityScore = 60;
deviationThreshold = 2;
var premiumRate = await getPremiumRate(rpcUrl, poolAddress, poolAbi, ultravityScore, deviationThreshold);
console.log("Premium rate is", premiumRate);