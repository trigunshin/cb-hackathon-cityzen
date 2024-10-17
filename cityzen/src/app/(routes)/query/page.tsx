"use client"
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
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {
  NewsArticles,
  EventsResults,
  CityHallResults,
  MainContentResult,
} from "@/app/components";
import { getArticleData } from "@/app/utils/getArticles";
import { QueryResponse } from "@/app/utils/types";
import { useCustomTheme } from "@/app/styles/theme";

// import { getCityVideoData } from "@/app/utils/getCityHall";

const drawerWidth = 240;
const menuItems = ["Main Content", "News Articles", "Events", "City Hall"];

export default function ContentPage() {
  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Main Content");
  const [content, setContent] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useCustomTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

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
          <Typography variant="h3" padding={2} color={theme.palette.text.primary} alignContent={'center'} height={'100%'} textAlign="center" gutterBottom>Select an item from the menu to view content.</Typography>
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
      {isLargeScreen ? (
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
          <Button
            color="inherit"
            aria-label="back button"
            // onClick={}
            sx={{ m: 1, gap: 1 }}
            size="small"
          >
            <ArrowBackIcon />
            <Typography>Back</Typography>
          </Button>
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
          sx={{ overflow: "auto", height: "100%", backgroundColor: `${theme.palette.background.default}`}}
        >
          <List sx={{ alignContent: "space-around", height: "100%" }}>
            {menuItems.map((text, index) => (
              <ListItem key={index} disablePadding>
                <Button
                  fullWidth
                  size="large"
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
                  <ListItemText><Typography>{text}</Typography></ListItemText>
                </Button>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <IconButton
            color="inherit"
            aria-label="back button"
            onClick={toggleTheme}
            sx={{ m: 1, gap: 1 }}
            size="small"
          >
            <DarkModeIcon /> 
          </IconButton>
          {/* <Button
            color="inherit"
            aria-label="show drawer"
            onClick={handleDrawerToggle}
            size="small"
            sx={{ m: 1 }}
          >
            <ArrowForwardIcon />
          </Button> */}
        </Stack>
        <Divider />
        </Drawer>
    ) : (
      <AppBar sx={{zIndex: 100}} color={theme.palette.background.default} >
        <Toolbar>
          {menuItems.map((text, index) => (
            <Button
              key={index}
              size="large"
              onClick={() => handleDrawerItem(text)}
              sx={{
                color: selectedItem === text ? "#72BAE3" : "inherit",
              }}
            >
              <Typography variant="caption"> 
                {text} 
              </Typography>
            </Button>
          ))}
        </Toolbar>
        <Divider />
      </AppBar>
    )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          backgroundColor: `${theme.palette.background.paper}`,
          transition: "margin-left 0.3s",
          marginLeft: open ? 0 : `-${drawerWidth}px`,
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          height: '100%',
          minHeight: '100vh'
        }}
      >
        <Container //can change to box
          sx={{ width: "100%", height: "100vh", }}
        >
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: `${theme.palette.background.default}`,
              width: "100%",
              pt: 7,
              alignContent: "center",
              height: "100vh", // Adjust this value based on your layout
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
