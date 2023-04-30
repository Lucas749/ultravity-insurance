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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/system";

import { Typography } from "@mui/material";

import Web3 from 'web3';
import { useNetwork } from 'wagmi'


const GradientHighText = styled(Typography)(({ theme }) => ({
  backgroundClip: "text",
  backgroundImage: "linear-gradient(85.9deg, #FF0000 -14.21%, #FF4500 18.25%, #FF6347 52.49%, #FF7F50 81.67%, #FFA07A 111.44%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const GradientMediumText = styled(Typography)(({ theme }) => ({
  backgroundClip: "text",
  backgroundImage: "linear-gradient(85.9deg, #FF8C00 -14.21%, #FFA500 18.25%, #FFD700 52.49%, #FFDEAD 81.67%, #FFE4B5 111.44%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const GradientLowText = styled(Typography)(({ theme }) => ({
  backgroundClip: "text",
  backgroundImage: "linear-gradient(85.9deg, #1E90FF -14.21%, #4169E1 18.25%, #6495ED 52.49%, #87CEFA 81.67%, #ADD8E6 111.44%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

  function DashboardPage(props) {
    const { chain, chains } = useNetwork();
//
const web3 = new Web3();
const [rows, setRows] = useState([]);


 

    const router = useRouter();

   
  const [value, setValue] = useState('all')
  const [searchText, setSearchText] = useState("Frog");
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);




 

  
  return (

    <> 
      <Meta title="Dashboard" />
      <Snackbar
      open={successAlertOpen}
      autoHideDuration={6000}
      onClose={handleCloseSuccessAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleCloseSuccessAlert} severity="success">
        Coverage successfully purchased!
      </Alert>
    </Snackbar>
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
        <Grid item={true} ml={-4} mr={4}xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <GradientHighText sx={{ fontWeight: "bold" }} variant="h5">
                    High Risk
                      </GradientHighText>
                      <Typography>Insures transactions with Ultravity scores of less than 50</Typography>
                      </CardContent>
              </Card>
            </Grid>
            <Grid item={true} ml={-4} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                        <GradientMediumText sx={{ fontWeight: "bold" }} variant="h5">
                      Medium Risk
                      </GradientMediumText>
                      <Typography>Insures transactions with Ultravity scores of 50 to 70</Typography>
                      </CardContent>
              </Card>
            </Grid>
          <Grid item={true} ml={0} xs={12} md={4}>
              <Card>
                      <CardContent sx={{ padding: 3}}>
                      <GradientLowText sx={{ fontWeight: "bold" }} variant="h5">
                    Low Risk
                      </GradientLowText>
                      <Typography>Insures transactions with Ultravity scores of more than 70</Typography>
                      </CardContent>
              </Card>
            </Grid>
            
          
      
          
          
         <ContentCardsSection successAlertOpen = {successAlertOpen} setSuccessAlertOpen= {setSuccessAlertOpen} />  
              
               
    
          
          </Grid>

          
      </Container>
    </Section>
      
       
   
    </>

    
  );
}

export default DashboardPage;





