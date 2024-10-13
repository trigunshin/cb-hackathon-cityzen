"use client";
import * as dotenv from "dotenv";
dotenv.config();
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Container, Grid, Stack } from "@mui/system";
import React, { useState } from "react";
import FlexibleChipStack from "./components/flexibleChips";
import ModernButton from "./components/modernButton";
import "./globals.css";
import EventCarousel from "./components/eventCarousel";

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}query?query=${inputValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
          minHeight={"100vh"}
          sx={{
            background: "radial-gradient(circle, #CBD6DD 37%, #72BAE3 100%)",
          }}
        >
          <EventCarousel />
          <Container sx={{ height: "100%", py: 4, alignContent: "center" }}>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h2" className="jaro" gutterBottom>
                Cityzen
              </Typography>
              <TextField
                label="Ask a question about your neighborhood"
                value={inputValue}
                variant="outlined"
                onChange={handleInputChange}
                fullWidth
                sx={{ width: "75%" }}
              />
              <Box width="100%">
                <FlexibleChipStack />
              </Box>
              <ModernButton onClick={handleSubmit}>Submit</ModernButton>
            </Stack>
          </Container>
        </Box>
        <Box sx={{ width: "100%", bgcolor: "white" }}>
          <Container sx={{ py: 4 }}>
            <Typography
              paddingY={4}
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
              columns={16}
              alignContent={"center"}
              textAlign={"center"}
              direction={{ lg: "row", md: "column" }}
              display={"flex"}
              flexWrap="wrap"
              flexDirection={"column"}
            >
              <Grid size={8}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Typography textAlign={"center"}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={8}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Paper>
              </Grid>
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
