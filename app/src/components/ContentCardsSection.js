import React from "react";
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

function ContentCardsSection(props) {
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
        return "success.main";
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
        return "success.main";
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
                      
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: "1rem" }}
                      >
                        Stake Now
                      </Button>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContentCardsSection;
