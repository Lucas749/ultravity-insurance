import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useRouter } from "next/router";
import Meta from "components/Meta";
import ContentCardsSection from "components/ContentCardsSection";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { makeStyles } from "@mui/styles";

import { Typography, Chip } from "@mui/material";

import Web3 from 'web3';
import { useNetwork } from 'wagmi'


const useStyles = makeStyles((theme) => ({
  
  priceChip: {
    backgroundColor: '#4caf50', 
    color: '#fff', 
  },
  gradientText: {
    backgroundClip: "text",
    backgroundImage: "linear-gradient(85.9deg, #6F00FF -14.21%, #8A2BE2 18.25%, #A020F0 52.49%, #BA55D3 81.67%, #C71585 111.44%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  toolbarContainer: {
    "& .MuiButton-root": {
      color: theme.palette.secondary.main,
    },
  },
}));

  function DashboardPage(props) {
    const { chain, chains } = useNetwork();
    
//
const web3 = new Web3();
const [rows, setRows] = useState([]);


 

    const router = useRouter();

   
  const [value, setValue] = useState('all')
  const [searchText, setSearchText] = useState("Frog");
  



 

  const classes = useStyles();
 
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
          <Grid item={true} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography sx={{ fontWeight: 'bold'}} className={classes.gradientText} variant='h5'>High Risk</Typography>
                      <Typography>Highest Risk, highest reward</Typography>
                      <br/>
                      </CardContent>
              </Card>
            </Grid>
            <Grid item={true} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography sx={{ fontWeight: 'bold'}} className={classes.gradientText} variant='h5'>Medium Risk</Typography>
                      <Typography>Medium risk, medium reward</Typography>
                      <br/>
                      </CardContent>
              </Card>
            </Grid>
            <Grid item={true} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography sx={{ fontWeight: 'bold'}} className={classes.gradientText} variant='h5'>Low Risk</Typography>
                      <Typography>Low risk, low reward</Typography>
                      <br/>
                      </CardContent>
              </Card>
            </Grid>
      
          
          
         <ContentCardsSection />  
              
               
    
          
          </Grid>

          
      </Container>
    </Section>
      
       
   
    </>

    
  );
}

export default DashboardPage;





