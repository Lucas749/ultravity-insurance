import { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useAccount } from "wagmi";
import {useSigner} from "wagmi";
import { BigNumber } from 'ethers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getAllPools } from "util/multicall";
import { ethers } from 'ethers';
const defaultItems = [
  {
    riskScore: 3,
    title: "Pool 1",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  },
  {
    riskScore: 2,
    title: "Pool 2",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  },
  {
    riskScore: 1,
    title: "Pool 3",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  },
  {
    riskScore: 3,
    title: "Pool 4",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  }
  ,
  {
    riskScore: 2,
    title: "Pool 5",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  }
  ,
  {
    riskScore: 1,
    title: "Pool 6",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  }
  ,
  {
    riskScore: 3,
    title: "Pool 7",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  },
  {
    riskScore: 2,
    title: "Pool 8",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  },
  {
    riskScore: 1,
    title: "Pool 9",
    description: "A well-established pool with a low risk score.",
    apr: "12.34%",
    amount: "1,234.56 ETH",
  }
  // Add more items with the necessary data
];

const rpcUrl = "https://rpc.testnet.mantle.xyz"
const poolAddress = "0x71C2468664b8c0c7d0ad0eA59C1fc1ddA15CDA7c"
const poolAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"},{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeOwner","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple","name":"","internalType":"struct Pools.Pool","components":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}]}],"name":"getPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}],"name":"getPoolIndex","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getPremiumRate","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"tuple[]","name":"","internalType":"struct Pools.UserStake[]","components":[{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"},{"type":"uint256","name":"stakedAmount","internalType":"uint256"}]}],"name":"getUserStakes","inputs":[{"type":"address","name":"user","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"insure","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"payClaim","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"claimAmount","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"score","internalType":"uint256"},{"type":"uint256","name":"totalStaked","internalType":"uint256"},{"type":"uint256","name":"totalValue","internalType":"uint256"}],"name":"pools","inputs":[{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"refundInsurance","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"premium","internalType":"uint256"},{"type":"address","name":"recipient","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"router","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setPool","inputs":[{"type":"uint256","name":"ultravityScore","internalType":"uint256"},{"type":"uint256","name":"deviationThreshold","internalType":"uint256"},{"type":"uint256","name":"baseRate","internalType":"uint256"},{"type":"uint256","name":"minPremium","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRouter","inputs":[{"type":"address","name":"_router","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setStakingToken","inputs":[{"type":"address","name":"_stakingToken","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"stake","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"stakedAmountsByUser","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"uint8","name":"","internalType":"uint8"},{"type":"uint8","name":"","internalType":"uint8"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IERC20"}],"name":"stakingToken","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint8","name":"scoreBucket","internalType":"uint8"},{"type":"uint8","name":"deviationBucket","internalType":"uint8"}]}]
const maxScoreIndex = 2;
const maxDeviationIndex = 2;

import {approvingContract, signingContract} from "../util/contract";
import {abi} from "../util/contract";

function ContentCardsSection(props) {
  const successAlertOpen = props.successAlertOpen
  const setSuccessAlertOpen= props.setSuccessAlertOpen
  const [items, setItems] = useState(defaultItems);
  console.log(items)
  
  const contractAddress = '0x6685c40769f9a2FEEE8D75f64cE1665F89953B28';
  const { address,isConnecting, isDisconnected } = useAccount();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (address) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [address]);
  // ...
  const [selectedPool, setSelectedPool] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  function openStakeModal(pool) {
    setSelectedPool(pool);
    setModalOpen(true);
  }

  function closeStakeModal() {
    setModalOpen(false);
    setStakeAmount('');
  }
  const {data: signer, isError, isLoading} = useSigner();
  const approveContract = approvingContract.connect(signer)
  const amountInWei = BigNumber.from('10000000000000000');

  const contractWithSigner = signingContract.connect(signer)
  const handleStakingTransaction = async (amount, scoreBucket, deviationBucket) => {
    console.log('clicked')
    try {
      let gasAcceptPrice = await signer.getGasPrice();

    await approveContract.approve("0x71C2468664b8c0c7d0ad0eA59C1fc1ddA15CDA7c", BigNumber.from('10000000000000000'),  {
      gasLimit: 300000,
      gasPrice: gasAcceptPrice.mul(1),
    });

    let gasPrice = await signer.getGasPrice();
      console.log(amount, scoreBucket, deviationBucket)
      await contractWithSigner.stake(amount, scoreBucket, deviationBucket, {
        gasLimit: 300000,
        gasPrice: gasPrice.mul(1),
      });

      setSuccessAlertOpen(true)
    
    } catch (error) {
      console.error('Error staking:', error);
    }
  };



  const getItemIndex = (score, deviationIndex) => {
    switch (score) {
      case 0:
        return deviationIndex * 3;
      case 1:
        return deviationIndex * 3 + 1;
      case 2:
        return deviationIndex * 3 + 2;
      default:
        return 0;
    }
  };
  
  useEffect(() => {
    (async () => {
      const updatedPools = await getAllPools(
        rpcUrl,
        poolAddress,
        poolAbi,
        maxScoreIndex,
        maxDeviationIndex
      );
      console.log("updatedPools", updatedPools);
  
      const updatedItems = [...defaultItems];
      updatedPools.forEach((poolData) => {
        const itemIndex = getItemIndex(poolData.score, poolData.deviationIndex);
        updatedItems[itemIndex] = {
          ...defaultItems[itemIndex],
          ...poolData,
          riskScore: 1 + poolData.score,
          deviationIndex: poolData.deviationIndex,
          apr: `Pool Return: ${(poolData.valueAccrual * 100).toFixed(2)}%`, // Set APR based on base-rate
          amount: `Total Staked: ${poolData.totalStaked} BIT`,
          description: poolData.deviationIndex === 0
          ? 'Insures transactions that deviate less than 2'
          : poolData.deviationIndex === 1
          ? 'Insures transactions that deviate between 2% and 5%'
          : 'Insures transactions that deviate more than 5%',
        };
      });
  
      setItems(updatedItems);
    })();
  }, []);
  
  
  

  function getRiskScoreColor(riskScore) {
    switch (riskScore) {
      case 3:
        return "blue";
      case 2:
        return "warning.main";
      case 1:
        return "error.main";
      default:
        return "textPrimary";
    }
  }

  function getRiskScoreBorderColor(riskScore) {
    switch (riskScore) {
      case 3:
        return "blue";
      case 2:
        return "warning.main";
      case 1:
        return "error.main";
      default:
        return "grey.500";
    }
  }

  return (
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
        <Grid container={true} justifyContent="center" spacing={5}>
          {items.map((item, index) => (
            <Grid item={true} xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: getRiskScoreBorderColor(item.riskScore),
                  transition: "transform 0.3s, box-shadow 0.3s",
                  ":hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          backgroundColor: "lightgrey",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "1rem",
                          border: "2px solid",
                          borderColor: getRiskScoreBorderColor(item.riskScore),
                        }}
                      >
                       <Typography
                          variant="h6"
                          component="div"
                          color={getRiskScoreColor(item.riskScore)}
                        >
                          {item.riskScore}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom={true}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        gutterBottom={true}
                      >
                        {item.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <Typography
                          variant="h7"
                          component="div"
                          color="success.main"
                         
                        >
                          {item.apr}
                        </Typography>
                        
                        <Box
                          sx={{
                            borderLeft: "1px solid grey", 
                            paddingLeft: "1rem",
                          }}
                        >
                          <Typography
                            variant="h7"
                            component="div"
                            color="textPrimary"
                          >
                            {item.amount}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {connected ? (
  <Button
    color="primary"
    variant="contained"
                  sx={{
                    backgroundImage: "linear-gradient(85.9deg, #6F00FF -14.21%, #8A2BE2 18.25%, #A020F0 52.49%, #BA55D3 81.67%, #C71585 111.44%)",
                    color: 'white',
                    ml: 0,
                    marginTop: "1rem"
                  }} 
    onClick={() => openStakeModal(item)}
  >
    Stake Now
  </Button>
) : (
  <ConnectButton />
)}

                    </Box>
                  </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
       <Dialog
            open={modalOpen}
            onClose={closeStakeModal}
            aria-labelledby="staking-dialog"
            maxWidth="lg"
            fullScreen={false}
            BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.7)" }}}
          >
            {selectedPool && (
              <>
                <DialogTitle id="staking-dialog">Stake in {selectedPool.title}</DialogTitle>
                
                <DialogContent
                
                
                >
                   <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
                  
                  <br></br>
                  <TextField
                    label="WBIT to Stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    type="number"
                    id="wbit-input"
                    className="staking-amount-input"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      style: { color: "white" }

                    }}
                  />
                  <Typography>
                  <br></br>
                    Base Insurance Rate: {selectedPool.apr}</Typography>
              
                </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                  <Button sx= {{color: "white"}} color="secondary" variant="outlined" onClick={closeStakeModal}>Cancel</Button>

                  
                  <Button variant="contained"
                  sx={{
                    backgroundImage: "linear-gradient(85.9deg, #6F00FF -14.21%, #8A2BE2 18.25%, #A020F0 52.49%, #BA55D3 81.67%, #C71585 111.44%)",
                    color: 'white',
                    mr: 0,
                  }}  
                  
                  onClick={() => {
                    const amountInput = document.getElementById("wbit-input");
                    const stakingAmount = ethers.utils.parseUnits(amountInput.value, 18); // Assumes 18 decimals
                    console.log('risk', selectedPool.riskScore-1)
                    console.log('stake', stakingAmount)
                    console.log('deviation', selectedPool.deviationIndex)
                    handleStakingTransaction(stakingAmount, selectedPool.riskScore - 1, selectedPool.deviationIndex);
                  }}
                  
                  >
                    Stake
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
    </Section>

    
  );
}

export default ContentCardsSection;
