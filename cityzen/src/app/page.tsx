"use client";
import * as dotenv from "dotenv";
dotenv.config();
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Container, Grid, Stack } from "@mui/system";
import React, { useState } from "react";
import FlexibleChipStack from "./components/flexibleChips";
import ModernButton from "./components/modernButton";
import "./globals.css";
import EventCarousel from "./components/eventCarousel";

const METRALL_INFO = {
  left: {
    title:
      "Simplifying civic engagement in LA. Your city's pulse, at your fingertips.",
    description:
      "Metrall empowers residents of Los Angeles by offering easy access to the latest local news, events, and civic activities. With AI-driven insights, Metrall keeps you informed on important community matters, from city council meetings to public events, all in one intuitive platform. Stay connected to the pulse of your neighborhood and make informed decisions about your city.",
  },
  right: {
    title: "Empowering informed communities through AI-driven insights.",
    description:
      "Metrall is more than just a news aggregator; it brings together real-time data from various sources, including city governance updates, local events, and social causes, offering personalized information based on your interests and location. Whether it's attending a neighborhood council meeting or learning about a new policy affecting your area, Metrall makes civic participation accessible for everyone.",
  },
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}query?query=${inputValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error during fetch:", error);
    }
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
          bgcolor={"#eeeeee"}
          sx={{
            alignContent: "center",
          }}
        >
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
              <ModernButton onClick={handleSubmit}>Submit</ModernButton>
            </Stack>
          </Container>
        </Box>
        <Divider />
        <EventCarousel />
        <Divider />
        <Box sx={{ width: "100%", bgcolor: "white" }}>
          <Container sx={{ py: 4 }}>
            <Typography
              paddingY={5}
              variant="h4"
              textAlign={"center"}
              color="#72BAE3"
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
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "24px",
                      backgroundColor: "#f7f7f7",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      fontSize={"18px"}
                      textAlign={"center"}
                      gutterBottom
                      style={{
                        color: "#868686",
                        marginBottom: "16px",
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{
                        flexGrow: 1,
                        overflow: "auto",
                        fontSize: "clamp(0.875rem, 2vw, 1rem)",
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
