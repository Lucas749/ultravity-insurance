import React, { useEffect, useState } from "react";
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
  gradientHighText: {
    backgroundClip: "text",
    backgroundImage: "linear-gradient(85.9deg, #FF0000 -14.21%, #FF4500 18.25%, #FF6347 52.49%, #FF7F50 81.67%, #FFA07A 111.44%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  gradientMediumText: {
    backgroundClip: "text",
    backgroundImage: "linear-gradient(85.9deg, #FF8C00 -14.21%, #FFA500 18.25%, #FFD700 52.49%, #FFDEAD 81.67%, #FFE4B5 111.44%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  gradientLowText: {
    backgroundClip: "text",
    backgroundImage: "linear-gradient(85.9deg, #1E90FF -14.21%, #4169E1 18.25%, #6495ED 52.49%, #87CEFA 81.67%, #ADD8E6 111.44%)",
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
                      <Typography sx={{ fontWeight: 'bold'}} className={classes.gradientHighText} variant='h5'>High Risk</Typography>
                      <Typography>Highest Risk, highest reward</Typography>
                      </CardContent>
              </Card>
            </Grid>
            <Grid item={true} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography sx={{ fontWeight: 'bold'}} className={classes.gradientMediumText} variant='h5'>Medium Risk</Typography>
                      <Typography>Medium risk, medium reward</Typography>
                      </CardContent>
              </Card>
            </Grid>
            <Grid item={true} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <Typography sx={{ fontWeight: 'bold'}} className={classes.gradientLowText} variant='h5'>Low Risk</Typography>
                      <Typography>Low risk, low reward</Typography>
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





