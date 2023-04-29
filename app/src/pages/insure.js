import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Meta from "components/Meta";
import ContentCardsSection from "components/ContentCardsSection";
import { useAccount } from "wagmi";

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
import { signTypedData } from "@wagmi/core";



  function DashboardPage(props) {
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

    const handleBuyNow = async () => {
      // Check if the user is connected to the wallet
      if (!connected) {
        // Prompt the user to connect their wallet if they haven't
        console.log("Please connect your wallet first");
        return;
      }
    
      // Define the typed data structure according to EIP-712
      const domain = {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      };
    
      const types = {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      };
    
      const value = {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      };
    
      try {
        // Call the signTypedData function
        const signature = await signTypedData(address, types, value, domain);
    
        // Process the signed data, e.g., send it to the backend
        console.log("Signature:", signature);
      } catch (error) {
        console.error("Error signing the typed data:", error);
      }
    };
    

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
        setUltravityScore(router.query.risk_score);
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





