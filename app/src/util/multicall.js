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
export async function getPremiumRate(rpc_url, contract_address, abi, ultravityScore, deviationThreshold) {
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

