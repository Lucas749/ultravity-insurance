import os
import time
os.chdir('./contract_setup_helper')
from config import node_url,staking_token, pool_address, router_address, ERC20_abi, pool_abi, router_abi
from config_private import private_key, account


from web3 import Web3
web3 = Web3(Web3.HTTPProvider(node_url))
web3.isConnected()
web3.eth.syncing
web3.eth.get_block_number()
chain_id = web3.eth.chain_id

#Set up pools
pool_contract = web3.eth.contract(address= pool_address, abi = pool_abi)
setup_pools_func = pool_contract.functions.setPool
staking_func = pool_contract.functions.stake

scores = [49, 69, 100]
deviations = [2, 5, 10]
base_rates = [2000, 2500, 3000, 1500, 2000, 2500, 750, 1000, 1250]

counter = 0
for score in scores:
    for dev in deviations:
        base_rate = base_rates[counter]
        print(f"Setting up pool {score} and {dev}, base rate {base_rate}")

        call_data = setup_pools_func(score, dev, base_rate, 100).buildTransaction({'from': account,'chainId':chain_id, 'gas': 300000, 'gasPrice': 2,'nonce':1})['data']

        nonce = web3.eth.get_transaction_count(account)
        tx_build = {'nonce': nonce,
            'gas': 300000,
            'gasPrice': web3.eth.gas_price,
            'to': pool_contract.address,
            "value": 0,
            "data": call_data,
            'chainId': chain_id}

        sign_tx = web3.eth.account.signTransaction(tx_build, private_key=private_key)

        _ = web3.eth.send_raw_transaction(sign_tx.rawTransaction)

        time.sleep(2)

        counter += 1

#Approve WBIT approval
wbit_contract = web3.eth.contract(address=staking_token, abi = ERC20_abi)

wbit_contract.functions.allowance("0x82cce31fd049b7cd23de3d1f201aea09907b9c25",pool_address).call()
wbit_approval_data = wbit_contract.functions.approve(pool_address, int(10000*1e18)).buildTransaction({'from': account,'chainId':chain_id, 'gas': 300000, 'gasPrice': 2,'nonce':1})['data']

nonce = web3.eth.get_transaction_count(account)
tx_build = {'nonce': nonce,
    'gas': 300000,
    'gasPrice': web3.eth.gas_price,
    'to': wbit_contract.address,
    "value": 0,
    "data": wbit_approval_data,
    'chainId': chain_id}

sign_tx = web3.eth.account.signTransaction(tx_build, private_key=private_key)
_ = web3.eth.send_raw_transaction(sign_tx.rawTransaction)

#Stake an amount
for i in range(4):
    for j in range(4):
        print(f"Staking pool {i} and {j}")
        call_data = staking_func(15, i, j).buildTransaction({'from': account,'chainId':chain_id, 'gas': 300000, 'gasPrice': 2,'nonce':1})['data']

        nonce = web3.eth.get_transaction_count(account)
        tx_build = {'nonce': nonce,
            'gas': 300000,
            'gasPrice': web3.eth.gas_price,
            'to': pool_contract.address,
            "value": 0,
            "data": call_data,
            'chainId': chain_id}

        sign_tx = web3.eth.account.signTransaction(tx_build, private_key=private_key)

        _ = web3.eth.send_raw_transaction(sign_tx.rawTransaction)

        time.sleep(2)

#Set up router



#Deploy PERMIT2 compiled contract
from config import permit2_compiled, permit2_abi
nonce = web3.eth.get_transaction_count(account)

contract_ = web3.eth.contract(
    abi=permit2_abi,
    bytecode=permit2_compiled)

construct_txn = contract_.constructor().buildTransaction({
    'from': account,
    'nonce': nonce,
    'gas': 3000000,
    'gasPrice': web3.eth.gas_price})

sign_tx = web3.eth.account.signTransaction(construct_txn, private_key=private_key)
_ = web3.eth.send_raw_transaction(sign_tx.rawTransaction)