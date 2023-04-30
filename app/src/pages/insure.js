import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Meta from "components/Meta";
import ContentCardsSection from "components/ContentCardsSection";
import { useAccount } from "wagmi";

import {PermitTransferFrom} from "@uniswap/permit2-sdk";
import {SignatureTransfer} from "@uniswap/permit2-sdk";
import {ethers} from "ethers";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useNetwork } from "wagmi";
import { Typography, Chip } from "@mui/material";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Web3 from 'web3';
import { getPremiumRate } from "util/multicall";
import { makeStyles } from "@mui/styles";
import TextField from '@mui/material/TextField';
import {useSigner} from "wagmi";
import {signTypedData} from "wagmi";
// Set up the private key
const privateKey = "0x";
const nodeUrl = "https://rpc.testnet.mantle.xyz";



  function DashboardPage(props) {

    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
    const {data: signer, isError, isLoading} = useSigner();
    console.log(signer)
async function getCurrentBlockNumber() {
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
}
getCurrentBlockNumber();

// Define the contract variables
const stakingToken = "0xc0A7F1B0c9988FbC123f688a521387A51596da47"
const poolAddress = "0x71C2468664b8c0c7d0ad0eA59C1fc1ddA15CDA7c"
const routerAddress = "XX"
const rpcUrl = "https://rpc.testnet.mantle.xyz"
const user = "0xf2B719136656BF21c2B2a255F586afa34102b71d"
const ERC20Abi = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
const poolAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"},{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeOwner","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct Pools.Pool","components":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}]}],"name":"getPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}],"name":"getPoolIndex","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPremiumRate","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Pools.UserStake[]","components":[{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"},{"type":"uint256","name":"stakedAmount","internalType":"uint256"}]}],"name":"getUserStakes","inputs":[{"type":"address","name":"user","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"insure","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"payClaim","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"claimAmount","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}],"name":"pools","inputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"refundInsurance","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"router","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRouter","inputs":[{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setStakingToken","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmountsByUser","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stakingToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]}]

    const useStyles = makeStyles((theme) => ({
      gradientText: {
        backgroundClip: "text",
        backgroundImage: "linear-gradient(85.9deg, #6F00FF -14.21%, #8A2BE2 18.25%, #A020F0 52.49%, #BA55D3 81.67%, #C71585 111.44%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    }));
    const { chain, chains } = useNetwork();
    const [connected, setConnected] = useState(false);

    const { address,isConnecting, isDisconnected } = useAccount();
    useEffect(() => {
      if (address) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    }, [address]);
//
const web3 = new Web3();
const [rows, setRows] = useState([]);


 

    const router = useRouter();
    const [amount, setAmount] = useState(null);
    const [fromChain, setfromChain] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ultravityScore, setUltravityScore] = useState(70);
    const [coverageAmount, setCoverageAmount] = useState(2);
    const [deviationThreshold, setDeviationTreshold] = useState(2);
    const [quote, setQuote] = useState('-');
    const [premiumRate, setPremiumRate] = useState('-')
    async function fetchPremium() {
      let result = await getPremiumRate(rpcUrl, poolAddress, poolAbi, ultravityScore, deviationThreshold)
      setPremiumRate(result)
      setQuote(result * coverageAmount)
      console.log(result)
    }
    const handleCoverageAmountChange = (event) => {
      setCoverageAmount(event.target.value);
      fetchPremium();
      //setPremiumRate(getPremiumRate(rpcUrl, poolAddress, poolAbi, ultravityScore, deviationThreshold))
     // console.log(premiumRate)

    };
    const handleDeviationAmountChange = (event) => {
      setDeviationTreshold(event.target.value);
      fetchPremium()
      //setPremiumRate(getPremiumRate(rpcUrl, poolAddress, poolAbi, ultravityScore, deviationThreshold))
     // console.log(premiumRate)

    };
//////////////////////////////////////////////
    const handleBuyNow = async () => {
      // Check if the user is connected to the wallet
      if (!connected) {
        // Prompt the user to connect their wallet if they haven't
        console.log("Please connect your wallet first");
        return;
      }
    
      const permitContract = "0x08B4434924801AC9C0B1a65D21562f2964b0787B"; //0x9345915e2f1d0105695Dd4689774B5f44f67A787
      const insuranceContract = "0xebE4C3052624a9909b1F5E8EAD080155dcDffdb1";//"0x35a3a5ed7eEdbdE2Ae8BE83687559564e5Df837f";
      const tokenAddress = "0xc0A7F1B0c9988FbC123f688a521387A51596da47";
      const premiumAmount = 750;//ethers.utils.parseEther("100");

        async function getSignature(permitContract, insuranceContract, tokenAddress, premiumAmount) {
          const permit2Abi = '[{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"AllowanceExpired","type":"error"},{"inputs":[],"name":"ExcessiveInvalidation","type":"error"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"uint256","name":"maxAmount","type":"uint256"}],"name":"InvalidAmount","type":"error"},{"inputs":[],"name":"InvalidContractSignature","type":"error"},{"inputs":[],"name":"InvalidNonce","type":"error"},{"inputs":[],"name":"InvalidSignature","type":"error"},{"inputs":[],"name":"InvalidSignatureLength","type":"error"},{"inputs":[],"name":"InvalidSigner","type":"error"},{"inputs":[],"name":"LengthMismatch","type":"error"},{"inputs":[{"internalType":"uint256","name":"signatureDeadline","type":"uint256"}],"name":"SignatureExpired","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"spender","type":"address"}],"name":"Lockdown","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint48","name":"newNonce","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"oldNonce","type":"uint48"}],"name":"NonceInvalidation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint160","name":"amount","type":"uint160"},{"indexed":false,"internalType":"uint48","name":"expiration","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"nonce","type":"uint48"}],"name":"Permit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"word","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mask","type":"uint256"}],"name":"UnorderedNonceInvalidation","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint48","name":"newNonce","type":"uint48"}],"name":"invalidateNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wordPos","type":"uint256"},{"internalType":"uint256","name":"mask","type":"uint256"}],"name":"invalidateUnorderedNonces","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"internalType":"struct IAllowanceTransfer.TokenSpenderPair[]","name":"approvals","type":"tuple[]"}],"name":"lockdown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"nonceBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails[]","name":"details","type":"tuple[]"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitBatch","name":"permitBatch","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"uint48","name":"expiration","type":"uint48"},{"internalType":"uint48","name":"nonce","type":"uint48"}],"internalType":"struct IAllowanceTransfer.PermitDetails","name":"details","type":"tuple"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"sigDeadline","type":"uint256"}],"internalType":"struct IAllowanceTransfer.PermitSingle","name":"permitSingle","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions","name":"permitted","type":"tuple"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails","name":"transferDetails","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ISignatureTransfer.TokenPermissions[]","name":"permitted","type":"tuple[]"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct ISignatureTransfer.PermitBatchTransferFrom","name":"permit","type":"tuple"},{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"requestedAmount","type":"uint256"}],"internalType":"struct ISignatureTransfer.SignatureTransferDetails[]","name":"transferDetails","type":"tuple[]"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"witness","type":"bytes32"},{"internalType":"string","name":"witnessTypeString","type":"string"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"permitWitnessTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"internalType":"struct IAllowanceTransfer.AllowanceTransferDetails[]","name":"transferDetails","type":"tuple[]"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint160","name":"amount","type":"uint160"},{"internalType":"address","name":"token","type":"address"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]';


          const chainId = (await provider.getNetwork()).chainId;
          console.log("chain id", chainId);
      
          const permit = new ethers.Contract(permitContract, permit2Abi, signer);
          

          
          //Get random nonce
          const nonce = Math.floor(Math.random() * 1001);

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

          const { domain, types, values } = SignatureTransfer.getPermitData(
              { ...message, spender: insuranceContract },
              permitContract,
              chainId
          );
         

          const signature = await signer._signTypedData(domain, types, values);

          console.log("Signature:", signature);
          return {"sig":signature, "nonce": nonce, "deadline":deadline};
        }

      try {
       
        var signatureData = await getSignature(permitContract, insuranceContract, tokenAddress, premiumAmount);
        console.log(signatureData)


      } catch (error) {
        console.error("Error signing the typed data:", error);
      }
    };
    
/////////////////////////////////////////////////////
    useEffect(() => {
      if (router.query.amount) {
        setAmount(router.query.amount);
      }
      if (router.query.chain) {
        setfromChain(router.query.chain);
      }
      if (router.query.contract_address) {
        setContractAddress(router.query.contract_address);
      }
      if (router.query.risk_score) {
        const roundedRiskScore = Math.round(parseFloat(router.query.risk_score));
    setUltravityScore(roundedRiskScore);
      }
    }, [router.query]);
  
    console.log(amount, fromChain, contractAddress, ultravityScore)
   
  const [value, setValue] = useState('all')
  const [searchText, setSearchText] = useState("Frog");
  



 

 
  return (

    <> 
      <Meta title="Dashboard" />
      <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={4}
          sx={{ textAlign: "center" }}
        />

        
        <Grid container={true} spacing={2}>
          <Grid item={true} xs={12} md={6}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography sx={{ fontWeight: 'bold'}}  variant='h5'>Get Coverage</Typography>
                      <Typography>Get protection for your smart contract risks</Typography>
                      <br></br>
                      <Table>
                            <TableBody>
                             
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold'}}  >Covered Amount</TableCell>
                                <TableCell align="right">
                                  <TextField
                                    type="number"
                                    value={coverageAmount}
                                    onChange={handleCoverageAmountChange}
                                    inputProps={{ min: 0 }}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold'}}  >Deviation Amount</TableCell>
                                <TableCell align="right">
                                  <Select
                                    labelId="coverage-amount-label"
                                    value={deviationThreshold}
                                    onChange={handleDeviationAmountChange}
                                  >
                                    <MenuItem value={0}></MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                  </Select>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold'}}  >Premium Quote</TableCell>
                                <TableCell  align="right">
                                  {quote}
                                </TableCell>
                              </TableRow>
                     
                            </TableBody>
                      </Table>
                      <br></br>
                      <Button
                          variant="contained"
                          size="large"
                          onClick={handleBuyNow}
                          sx={{
                            backgroundImage: "linear-gradient(85.9deg, #6F00FF -14.21%, #8A2BE2 18.25%, #A020F0 52.49%, #BA55D3 81.67%, #C71585 111.44%)",
                            color: "white",
                            ml: 0,
                          }}
                        >
                          Buy Now
                        </Button>

                    
                      </CardContent>
              </Card>
            </Grid>
         
            <Grid item={true} xs={12} md={6}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography>Coverage Information</Typography>
                      <br></br>
                      <Table>
                            <TableBody>
                              <TableRow>
                                  <TableCell sx={{ fontWeight: 'bold'}} >Covered Addreess</TableCell>
                                  <TableCell align="right">
                                  {connected ? (
                                  address
                                  ):(
                                  <ConnectButton align = "right" />
                                  )}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold'}}  >Transaction Amount</TableCell>
                                <TableCell  align="right">
                                  Money
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold'}}  >Contract Address</TableCell>
                                <TableCell  align="right">
                                  {contractAddress}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold'}}  >Ultravity Score</TableCell>
                                <TableCell  align="right">
                                  {ultravityScore}
                                </TableCell>
                              </TableRow>
                     
                            </TableBody>
                      </Table>

                      </CardContent>
              </Card>
            </Grid>
      
          
          
              
               
    
          
          </Grid>

          
      </Container>
    </Section>
      
       
   
    </>

    
  );
}

export default DashboardPage;





