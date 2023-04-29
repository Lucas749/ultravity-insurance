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

import {approvingContract, signingContract} from "../util/contract";
import {abi} from "../util/contract";

function ContentCardsSection(props) {
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
    
    } catch (error) {
      console.error('Error staking:', error);
    }
  };
  
  const items = [
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

  function getRiskScoreColor(riskScore) {
    switch (riskScore) {
      case 1:
        return "blue";
      case 2:
        return "warning.main";
      case 3:
        return "error.main";
      default:
        return "textPrimary";
    }
  }

  function getRiskScoreBorderColor(riskScore) {
    switch (riskScore) {
      case 1:
        return "blue";
      case 2:
        return "warning.main";
      case 3:
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
        <Grid container={true} justifyContent="center" spacing={4}>
          {items.map((item, index) => (
            <Grid item={true} xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: getRiskScoreBorderColor(item.riskScore),
                }}
              >
                <CardActionArea>
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
                          variant="h6"
                          component="div"
                          color="success.main"
                          fontWeight="bold"
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
                            variant="body1"
                            component="div"
                            color="textPrimary"
                          >
                            {item.amount}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {connected ? (
  <Button
    variant="contained"
    color="primary"
    sx={{ marginTop: "1rem" }}
    onClick={() => openStakeModal(item)}
  >
    Stake Now
  </Button>
) : (
  <ConnectButton />
)}

                    </Box>
                  </CardContent>
                </CardActionArea>
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
                <DialogContent>
                  <Typography>APR: {selectedPool.apr}</Typography>
                  <TextField
                    label="Amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                  <Typography>
                    Predicted annual return:{" "}
                    {((parseFloat(stakeAmount) * parseFloat(selectedPool.apr)) / 100).toFixed(2)}{" "}
                    {selectedPool.amount.split(" ")[1]}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeStakeModal}>Cancel</Button>
                  <Button onClick={() => handleStakingTransaction(10, 0, 0)} color="primary">
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
