"use client";
import * as dotenv from "dotenv";
dotenv.config();
import {
  Box,
  Divider,
  IconButton,
  Paper,
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

const METRALL_INFO = {
  left: {
    title:
      "What is Metrall?",
    description:
      "Metrall empowers residents of Los Angeles by offering easy access to the latest local news, events, and civic activities. With AI-driven insights, Metrall keeps you informed on important community matters, from city council meetings to public events, all in one intuitive platform. Stay connected to the pulse of your neighborhood and make informed decisions about your city.",
  },
  right: {
    title: "How does Metrall work?",
    description:
      "Metrall is more than just a news aggregator; it brings together real-time data from various sources, including city governance updates, local events, and social causes, offering personalized information based on your interests and location. Whether it's attending a neighborhood council meeting or learning about a new policy affecting your area, Metrall makes civic participation accessible for everyone.",
  },
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
                onChange={handleInputChange}
                fullWidth
                sx={{
                  width: "75%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#868686",
                    },
                    "&:hover fieldset": {
                      borderColor: "#868686",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#868686",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#868686", // Default color of the floating label text
                  },
                  "& .MuiInputLabel-root:hover": {
                    color: "#868686", // Color on hover
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#868686", // Color when focused
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
        <Box sx={{ width: "100%", bgcolor: `${theme.palette.background.paper}` }}>
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
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="stretch"
            >
              {Object.entries(METRALL_INFO).map(([key, section], index) => (
                <Grid size={{ xs: 12, sm: 10, md: 6 }} key={key}>
                  <Paper
                    variant="outlined"
                    style={{
                      color: `${theme.palette.background.default}`,
                      border: `1px solid ${theme.palette.secondary.contrastText}`,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: '24px',
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      textAlign={"center"}
                      color={theme.palette.text.primary}
                      gutterBottom
                      style={{
                        marginBottom: "16px",
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.secondary}
                      style={{
                        flexGrow: 1,
                        overflow: "auto",
                      }}
                    >
                      {section.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        <Box sx={{ width: "100%", bgcolor: "white" }}>
          <Container sx={{ py: 4 }}></Container>
        </Box>
      </Box>
    </>
  );
}
