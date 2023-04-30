#Import packages
from flask_cors import CORS, cross_origin
from flask import Flask, request, Response
import logging
import sys
import json
import time
import requests

#import config
import os
os.getcwd()
os.chdir('./server')
from config_hackathon import  *
from config_private import account, private_key


from web3 import Web3

#Set up Flask app
app = Flask(__name__)
CORS(app)
print('ready')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

# Get last tx hash from mantle explorer
def get_last_tx_hash(address):
    try:
        headers_urllib = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0'}
        req = requests.get(f"https://explorer.testnet.mantle.xyz/address/{address}?type=JSON", headers=headers_urllib)
        req = req.json()
        last_tx_hash = req['items'][0].split('data-identifier-hash=')[1].split('>')[0].replace('\"',"")
    except:
        last_tx_hash = None
    return last_tx_hash


# Get balance changes from logs
def get_balance_changes_from_receipt(tx_receipt):
    transfer_topic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

    sender = tx_receipt['from'].lower()
    logs = tx_receipt['logs']
    balance_changes = {}
    for log in logs:
        if log['topics'][0].hex() == transfer_topic:
            from_address = "0x"+log['topics'][1].hex()[26:]
            to_address = "0x"+log['topics'][2].hex()[26:]
            value_send = int(log['data'],16) / 1e18
            if from_address == sender:
                balance_changes[log.address] = -value_send
            elif to_address == sender:
                balance_changes[log.address] = +value_send
    return balance_changes


#Set up routes
@app.route('/', methods=['GET'])
@cross_origin(headers=['Content- Type','Authorization'])
def landing_page():
    return "Welcome to Ultravity Insurance"


@app.route('/api/insuretx', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def insure_tx():
    """
    Returns security score
    @params:
        contract_address          - Required  : smart contract adddress interacting with (str)
        chain                     - Required  : smart contract chain (str)
        raw_tx                    - Required  : raw tx for simulation (str)
        transaction               - Required  : full transaction object with signing variables (supplied by wallet) (dict)
        api_key                   - Required  : api key / user id (str)
        from wallet               - Optional  : wallet / snaps flag (bool)
        ipfs                      - Optional  : upload to ipfs flag to overwrite config (bool)
    """
    #Unpack parameters
    contract_address = request.args.get('contract_address', type=str)
    chain = request.args.get('chain', default='ethereum', type=str)
    transaction = request.args.get('transaction', default='', type=str)
    balance_changes = request.args.get('balance_changes', default='', type=str)
    cover_amount = request.args.get('cover_amount', default='', type=str)
    premium_amount = request.args.get('premium_amount', default='', type=str)
    ultravity_score = request.args.get('ultravity_score', default='', type=float)
    deviation_threshold = request.args.get('deviation_threshold', default='', type=float)

    #Permit2
    deadline = request.args.get('deadline', default='', type=str)
    permit_nonce = request.args.get('nonce', default='', type=float)
    signature = request.args.get('signature', default='', type=float)
    
    
    #HC test
    contract_address = "0xf2B719136656BF21c2B2a255F586afa34102b71d"
    chain = "mantle"
    transaction={'data': '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000642c787700000000000000000000000000000000000000000000000000000000000000020b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000036377487531059e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000bb87fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000000000000000000000000000000000000000000', 'from': '0x2514fdb578baa5c81daed2da60535bb4c902119e', 'gas': '0x68958', 'to': '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b', 'value': '0x2386f26fc10000'}
    
    balance_changes = request.args.get('balance_changes', default='', type=str)
    cover_amount = 10000
    premium_amount = 750
    ultravity_score = 70
    deviation_threshold = 2

    #Permit2
    deadline = 1665666
    permit_nonce = 66
    signature = "0x3412485da985ad2cc4a157a1610f43877ecbe333952323d8114a520d13b835af3cfef9e82ab3d3f02201a89d0c97883cda5c1019be066e83beab2eb9065ed3671c"


    #Unpack transaction parameters
    if transaction != '':
        try:
            print(f"tx: {transaction} - type {type(transaction)}")
            if isinstance(transaction, str):
                try:
                    transaction = eval(transaction)
                except:
                    print('tx eval failed')
            
            #If tx dict is supplied parse to dict
            try:
                transaction = json.loads(transaction)
            except:
                print('ERROR: Transaction dict not in correct format')

            print(f"tx: {transaction} - type {type(transaction)}")
        except:
            return {"error": "faulty transaction data provided"}

    else:
        return {"error": "no transaction data provided"}
    
    #Get balance changes
    if balance_changes != '':
        try:
            print(f"tx: {balance_changes} - type {type(balance_changes)}")
            if isinstance(balance_changes, str):
                try:
                    balance_changes = eval(balance_changes)
                except:
                    print('tx eval failed')
            
            #If tx dict is supplied parse to dict
            try:
                balance_changes = json.loads(balance_changes)
            except:
                print('ERROR: balance_changes dict not in correct format')

            print(f"tx: {balance_changes} - type {type(balance_changes)}")
        except:
            return {"error": "faulty balance_changes provided"}

    else:
        return {"error": "no balance_changes provided"}
    
    sim_res_formatted = [["0xc0A7F1B0c9988FbC123f688a521387A51596da47",100],["0xa35d7f5dd89a336A427Ebb63C428C3068b6c3105",-100]]
    
    #Setup web3
    web3 = Web3(Web3.HTTPProvider(node_url_mantle))
    web3.isConnected()
    web3.eth.syncing
    web3.eth.get_block_number()
    chain_id = web3.eth.chain_id

    #Set up pools
    router_contract = web3.eth.contract(address= router_address, abi = router_abi)
    create_ins_func = router_contract.functions.createInsurance
    payout_ins_func = router_contract.functions.makeInsuranceClaimableAndPayout

    #Send insurance transaction
    call_data = create_ins_func(int(cover_amount),int(deviation_threshold),int(ultravity_score),str.encode(transaction['data']), web3.toChecksumAddress(transaction['from']), web3.toChecksumAddress(transaction['to']), sim_res_formatted, int(permit_nonce), int(deadline), str.encode(signature)).buildTransaction({'from': account,'chainId':chain_id, 'gas': 300000, 'gasPrice': 2,'nonce':1})['data']

    nonce = web3.eth.get_transaction_count(account)
    tx_build = {'nonce': nonce,
        'gas': 300000,
        'gasPrice': web3.eth.gas_price,
        'to': router_contract.address,
        "value": 0,
        "data": call_data,
        'chainId': chain_id}

    sign_tx = web3.eth.account.signTransaction(tx_build, private_key=private_key)

    insurance_tx_hash = web3.eth.send_raw_transaction(sign_tx.rawTransaction)

    time.sleep(2)
    insurance_tx_hash = "0x1504a109454345ca1a7f93f23d1b4711e435717f69619f0c30b89f8dc92d1952"
    insurance_receipt = web3.eth.get_transaction_receipt(insurance_tx_hash)
    
    if insurance_receipt.status == 0:
        return {'error': f'insurance tx failed {insurance_tx_hash}'}

    #Pull out insurance ID here
    insurance_id = int(insurance_receipt.logs[2]['topics'][1].hex(),16)

    #Monitor users tx outcome
    insured_address = web3.toChecksumAddress(transaction['to'])
    start_time = time.time()
    start_nonce_insured = web3.eth.get_transaction_count(insured_address)

    tx_found = False
    while time.time() - start_time <= 5*60:
        act_nonce = web3.eth.get_transaction_count(insured_address)

        if act_nonce > start_nonce_insured:
            print("Nonce increase")
            tx_found = True
            break

        
    if not tx_found:
        return {'error': 'no user transaction not found - consider refund'}
    else:
        #Get last tx has from mantle explore
        last_tx_hash = get_last_tx_hash(insured_address)

        if last_tx_hash == None:
            return {'error': 'cannot get user transaction from mantle - consider refund'}
            
        tx_receipt = web3.eth.get_transaction_receipt(last_tx_hash)
        
        #Get tx balance changes 
        act_balance_changes = get_balance_changes_from_receipt(tx_receipt)
        sim_balance_changes = dict(sim_res_formatted)

        all_tokens = list(set(list(sim_balance_changes.keys()) + list(act_balance_changes.keys())))
        token = all_tokens[0]
        
        #Compare simulation outcome
        perc_deviation = []
        for token in all_tokens:
            if (token in sim_balance_changes.keys() and not token in act_balance_changes.keys()) or (token not in sim_balance_changes.keys() and token in act_balance_changes.keys()):
                deviation = 100
            else:
                if token in sim_balance_changes.keys():
                    simulated = sim_balance_changes[token]
                if token in act_balance_changes.keys():
                    act = act_balance_changes[token]

                deviation = abs(((act/simulated) - 1)*100)

            perc_deviation.append(deviation)

        #Check if tx is eligible for insurance
        if max(perc_deviation) >= deviation_threshold:
            #Send insurance payout
            call_data = payout_ins_func(insurance_id).buildTransaction({'from': account,'chainId':chain_id, 'gas': 300000, 'gasPrice': 2,'nonce':1})['data']

            nonce = web3.eth.get_transaction_count(account)
            tx_build = {'nonce': nonce,
                'gas': 300000,
                'gasPrice': web3.eth.gas_price,
                'to': router_contract.address,
                "value": 0,
                "data": call_data,
                'chainId': chain_id}

            payout_tx_hash = web3.eth.send_raw_transaction(sign_tx.rawTransaction)

            print(f"Insurance paid out {payout_tx_hash}")


#Run Flask app
if __name__ == '__main__':
    #Server settings
    app.run()
