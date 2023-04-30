#Import packages
from flask_cors import CORS, cross_origin
from flask import Flask, request, Response
import logging
import sys

#Set up Flask app
app = Flask(__name__)
CORS(app)
print('ready')

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

#Set up routes
@app.route('/', methods=['GET'])
@cross_origin(headers=['Content- Type','Authorization'])
def landing_page():
    return "Welcome to Ultravity Insurance"


# @app.route('/api/insuretx', methods=['GET'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
# def insure_tx():
#     """
#     Returns security score
#     @params:
#         contract_address          - Required  : smart contract adddress interacting with (str)
#         chain                     - Required  : smart contract chain (str)
#         raw_tx                    - Required  : raw tx for simulation (str)
#         transaction               - Required  : full transaction object with signing variables (supplied by wallet) (dict)
#         api_key                   - Required  : api key / user id (str)
#         from wallet               - Optional  : wallet / snaps flag (bool)
#         ipfs                      - Optional  : upload to ipfs flag to overwrite config (bool)
#     """
#     #Unpack parameters
#     contract_address = request.args.get('contract_address', type=str)
#     chain = request.args.get('chain', default='ethereum', type=str)
#     transaction = request.args.get('transaction', default='', type=str)
#     balance_changes = request.args.get('balance_changes', default='', type=str)
#     cover_amount = request.args.get('cover_amount', default='', type=str)
#     ultravity_score = request.args.get('ultravity_score', default='', type=float)
#     deviation_threshold = request.args.get('deviation_threshold', default='', type=float)

#     #Permit2
#     deadline = request.args.get('deadline', default='', type=str)
#     nonce = request.args.get('nonce', default='', type=float)
#     signature = request.args.get('signature', default='', type=float)


#     #Unpack transaction parameters


#     #Insure transaction


#     #Monitor users tx outcome


#Run Flask app
if __name__ == '__main__':
    #Server settings
    app.run()