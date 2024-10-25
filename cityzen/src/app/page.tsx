"use client";
import * as dotenv from "dotenv";
dotenv.config();
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Container, Grid, Stack, useTheme } from "@mui/system";
import React, { useState } from "react";
import FlexibleChipStack from "./components/flexibleChips";
import ModernButton from "./components/modernButton";
import EventCarousel from "./components/eventCarousel";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useCustomTheme } from "./styles/theme";

import "./globals.css";
import GradientCard from "./components/gradientCard";

const METRALL_INFO = {
  left: {
    title:
      "What is Metrall?",
    imagePlacement: "right",
    button: true,
    link: '/about',
    description:
      "Metrall empowers communities by offering easy access to the latest local news, events, and civic activities. With AI-driven insights, Metrall keeps you informed on important community matters, from city council meetings to public events, all in one intuitive platform. Stay connected to the pulse of your neighborhood and make informed decisions about your city.",
    },
  right: {
    title: "How does Metrall work?",
    imagePlacement: "left",
    button: false,
    link: null,
    description:
      "Metrall is more than just a news aggregator; it brings together real-time data, offering information based on your interests and location. Metrall connects to various public data APIs and scrapes city council meeting data, then uses artifical intelligence to summarize real data to make information more accessible. ",
  },
  questions: [
    // City Government & Policy
    'What were the key decisions from yesterday\'s LA City Council meeting?',
    'How is LA spending its new infrastructure budget?',
    'What are the proposed changes to local zoning laws in Downtown LA?',
    'When is the next public hearing about the new transit project?',
    
    // Community & Neighborhoods
    'What new businesses have opened in Highland Park this month?',
    'Are there any upcoming neighborhood council meetings in Venice?',
    'What\'s the status of the new community garden project in Boyle Heights?',
    'Which streets will be closed for the upcoming CicLAvia event?',
    
    // Environment & Infrastructure
    'What\'s being done about water conservation in LA right now?',
    'When will the Metro Purple Line extension be completed?',
    'Are there any e-waste collection events happening this month?',
    'What\'s the air quality forecast for the San Fernando Valley today?',
    
    // Public Safety
    'Has there been any progress on the Vision Zero traffic safety initiative?',
    'What are the crime statistics for my neighborhood this quarter?',
    'Where can I find information about emergency preparedness workshops?',
    'Are there any active street repairs in Silver Lake?',
    
    // Culture & Events
    'What free concerts are happening at Levitt Pavilion this summer?',
    'Which museums are offering free admission this weekend?',
    'What food festivals are coming up in the next month?',
    'Are there any volunteer opportunities at local schools?',
    
    // Housing & Development
    'What new affordable housing projects are being built in South LA?',
    'How can I participate in the next community planning meeting?',
    'What are the current rent control regulations in Los Angeles?',
    'Which neighborhoods are seeing the most development activity?',
    
    // Education & Youth
    'What summer programs are available for teens in LA?',
    'When is the next LAUSD board meeting?',
    'Which public libraries are hosting reading programs?',
    'What after-school activities are available in my area?'
  ]
};


export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const { theme, toggleTheme } = useCustomTheme();


  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          color: "#868686",
        }}
      >
        <Box
          flex={1}
          bgcolor={theme.palette.background.paper}
          sx={{
            alignContent: "center",
          }}
        >
          <IconButton
            aria-label="switch mode"
            onClick={toggleTheme}
            sx={{
              m: 1,
              gap: 1,
              color: `${theme.palette.primary.contrastText}`,
              position: 'absolute',
              top: 8,
              left: 8,
            }}
            size="small"
          >
            <Brightness4Icon />
          </IconButton>
          <Container
            sx={{
              height: "100%",
              py: { lg: 10, md: 4, sm: 4, xs: 4 },
              alignContent: "center",
            }}
          >
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography
                variant="h1"
                paddingY={3}
                className="jaro"
                gutterBottom
              >
                Metrall
              </Typography>
              <TextField
                label="Ask a question about your neighborhood"
                value={inputValue}
                variant="outlined"
                multiline
                onChange={handleInputChange}
                fullWidth
                sx={{
                  width: "75%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: `${theme.palette.secondary.contrastText}`,
                    },
                    "&:hover fieldset": {
                      borderColor: `${theme.palette.secondary.contrastText}`,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: `${theme.palette.secondary.contrastText}`,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: `${theme.palette.secondary.contrastText}`,
                  },
                  "& .MuiInputLabel-root:hover": {
                    color: `${theme.palette.secondary.contrastText}`,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: `${theme.palette.secondary.contrastText}`,
                  },
                }}
              />

              <Box width="100%">
                <FlexibleChipStack />
              </Box>
              <ModernButton query={inputValue}>Submit</ModernButton>
            </Stack>
          </Container>
        </Box>
        <Divider sx={{ bgcolor: "secondary.contrastText" }} />
        <EventCarousel />
        <Divider sx={{ bgcolor: "secondary.contrastText" }} />
        <Box sx={{ width: "100%", height: '100%', bgcolor: `${theme.palette.background.paper}` }}>
          <Container sx={{ py: 4 }}>
            <Typography
              paddingY={5}
              variant="h3"
              textAlign={"center"}
              color={theme.palette.primary.main}
            >
              Simplifying civic engagement in LA. Your city's pulse, at your
              fingertips. Empowering informed communities through AI-driven
              insights.
            </Typography>
          </Container>
        </Box>
        <Divider sx={{ bgcolor: "secondary.contrastText" }} />
        <Box sx={{ position: 'relative', width: '100%' }}>
            <Grid container columns={16}>
              {Object.entries(METRALL_INFO)
                .filter(([key, section]) => key !== "questions")
                .map(([key, section]) => (
                  <Grid size={{xs: 16, sm: 16, md: 16}} alignContent={'center'} key={key}>
                    <GradientCard
                      section={section}
                      imagePlacement={section.imagePlacement} // Customizing imagePlacement per section
                      button={section.button}
                    />
                  </Grid>
              ))}
            </Grid>
            {/* <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', overflowY: 'hidden', justifyContent: 'center' }}>
              {METRALL_INFO.questions.reduce((acc, question, index) => {
                const row = Math.floor(index / 2);
                if (!acc[row]) {
                  acc[row] = [];
                }
                acc[row].push(
                  <Box key={index} sx={{ margin: "4px", padding: '4px', fontSize: '20px', border: `1px solid ${theme.palette.secondary.contrastText}`, borderRadius: 15,}}>
                    <Typography color={theme.palette.secondary.contrastText}>{question}</Typography>
                  </Box>  
                );
                return acc;
              }, []).map((chips, rowIndex) => (
                <Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px' }}>
                  {chips}
                </Box>
              ))}
            </Box> */}
          </Box>
      </Box>
    </>
  );
}
