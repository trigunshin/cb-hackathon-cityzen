"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Stack,
  Container,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  NewsArticles,
  EventsResults,
  CityHallResults,
  MainContentResult,
} from "@/app/components";
import { getArticleData } from "@/app/utils/getArticles";
import { QueryResponse } from "@/app/utils/types";
// import { getCityVideoData } from "@/app/utils/getCityHall";

const drawerWidth = 240;
const menuItems = ["Main Content", "News Articles", "Events", "City Hall"];

export default function ContentPage() {
  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Main Content");
  const [content, setContent] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("question");
    if (!query) return;
    const storedQuestion = JSON.parse(localStorage.getItem(query) || 'null');
    if (storedQuestion) {
      setContent(storedQuestion);
      setLoading(false);
      return
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}query?query=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        localStorage.setItem(query, JSON.stringify(data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error during fetch:", error);
      });
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleDrawerItem = (item: string) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Main Content":
        return <MainContentResult data={content?.response} />;
      case "News Articles":
        return <NewsArticles responseData={content?.nodes} />;
      case "Events":
        return <EventsResults/>
      case "City Hall":
      //@ts-ignore
      // return <CityHallResults data={getCityVideoData(data, 5)} />;
      default:
        return (
          <Typography padding={2}>Select an item from the menu to view content.</Typography>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", overflowY: 'hidden' }}>
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        edge="end"
        onClick={handleDrawerToggle}
        sx={{
          position: "absolute",
          left: open ? drawerWidth : 0,
          top: 0,
          p: 2,
          transition: "left 0.3s",
          visibility: open ? "hidden" : "visible",
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "fixed",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <IconButton
            color="inherit"
            aria-label="back button"
            // onClick={}
            sx={{ m: 1, gap: 1 }}
            size="small"
          >
            <ArrowBackIcon /> 
            <Typography>Back</Typography>
          </IconButton>
          <Button
            color="inherit"
            aria-label="show drawer"
            onClick={handleDrawerToggle}
            size="small"
            sx={{ m: 1 }}
          >
            <ArrowForwardIcon />
          </Button>
        </Stack>
        <Divider />
        <Stack
          sx={{ overflow: "auto", height: "100%", backgroundColor: "#ffffff" }}
        >
          <List sx={{ alignContent: "space-around", height: "100%" }}>
            {menuItems.map((text, index) => (
              <ListItem key={index} disablePadding>
                <Button
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    color: selectedItem === text ? "#72BAE3" : "#B0B0B0",
                    backgroundColor:
                      selectedItem === text
                        ? "rgba(0, 0, 0, 0.04)"
                        : "transparent",
                  }}
                  onClick={() => handleDrawerItem(text)}
                >
                  <ListItemText>{text}</ListItemText>
                </Button>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#B0B0B0",
          transition: "margin-left 0.3s",
          marginLeft: open ? 0 : `-${drawerWidth}px`,
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          height: 'max-content;',
          minHeight: '100vh'
        }}
      >
        <Container
          sx={{ width: "100%", height: "100%", alignContent: "center" }}
        >
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: "#ffffff",
              width: "100%",
              //p: 2,
              alignContent: "center",
              height: "calc(100vh - 50px)", // Adjust this value based on your layout
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading || !content ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <CircularProgress />
              </Box>
                    ) : (
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '0.3em'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                  }
                }}
              >                
              {renderContent()}
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
