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
  ButtonGroup,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import EventIcon from '@mui/icons-material/Event';
import FeedIcon from '@mui/icons-material/Feed';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocationCityIcon from '@mui/icons-material/LocationCity';
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
const menuItems = [
  {name: "Main Content", icon: <LocationCityIcon />},
  {name: "News Articles", icon: <NewspaperIcon />},
  {name: "Events", icon: <EventIcon />},
  {name: "City Hall", icon: <FeedIcon />}
];

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
      // return <CityHallResults data={getCityVideoData(data, 5)} />;
      default:
        return (
          <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} height={'100%'} textAlign="center" alignContent={'center'} gutterBottom>Select an item from the menu to view content.</Typography>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", overflowY: 'hidden'}}>
      <IconButton
        color='primary'
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
          color: `${theme.palette.primary.contrastText}`
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
            borderRight: `1px solid ${theme.palette.secondary.contrastText}`,
            boxSizing: "border-box",
            position: "fixed",
            color: `${theme.palette.background.paper}`,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", backgroundColor: `${theme.palette.primary.main}` }}
        >
          <Button
            aria-label="back"
            sx={{height: '100%', borderRadius: 0, color: `${theme.palette.primary.contrastText}`}}
            // onClick={}
            startIcon={<ArrowBackIcon />}
          >
            <Typography>Back</Typography>
          </Button>
          <Button
            color={theme.palette.primary.contrastText}
            size='small'
            aria-label="show drawer"
            onClick={handleDrawerToggle}
            sx={{ minWidth: 0, p: 1, borderRadius: 0, color: `${theme.palette.primary.contrastText}` }}
          ><ArrowForwardIcon /></Button>
        </Stack>
        <Divider sx={{ bgcolor: "secondary.contrastText" }} />
        <Stack
          sx={{ overflow: "auto", height: "100%", backgroundColor: `${theme.palette.background.paper}`}}
        >
          <ButtonGroup
            orientation="vertical"
            fullWidth
            variant="outlined"
            sx={{ height: "100%", alignContent: "space-around", alignContent: 'center' }}
          >
            {menuItems.map((item, index) => (
              <Button
                key={index}
                size="large"
                sx={{
                  borderRadius: 0,
                  justifyContent: "flex-start",
                  width: '100%',
                  color: selectedItem === item.name ? "primary" : `${theme.palette.primary.dark}`,
                  backgroundColor:
                    selectedItem === item.name
                      ? "rgba(0, 0, 0, 0.05)"
                      : "transparent",
                }}
                onClick={() => handleDrawerItem(item.name)}
                startIcon={item.icon}
              >
                <Typography variant='button'>{item.name}</Typography>
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
        <Divider sx={{ bgcolor: "secondary.contrastText" }}  />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", backgroundColor: `${theme.palette.primary.main}` }}
        >
          <IconButton
            aria-label="switch mode"
            onClick={toggleTheme}
            sx={{ m: 1, gap: 1, color: `${theme.palette.primary.contrastText}` }}
            size="small"
          >
            <Brightness4Icon /> 
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
        </Drawer>
    ) : (
      <AppBar elevation={0} sx={{zIndex: 100,  opacity: 1, backgroundColor: "background.paper", borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,    }} >
      <Toolbar>
        {menuItems.map((item, index) => (
          <Button
            key={index}
            size="small"
            onClick={() => handleDrawerItem(item.name)}
            sx={{
              height: '100%',
              color: selectedItem === item.name ? "primary" : `${theme.palette.primary.dark}`,
            }}
            startIcon={item.icon}
          >
            <Typography variant="caption"> 
              {item.name} 
            </Typography>
          </Button>
        ))}
      </Toolbar>
    </AppBar>

    )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          backgroundColor: `${theme.palette.background.default}`,
          transition: "margin-left 0.3s",
          marginLeft: open ? 0 : `-${drawerWidth}px`,
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          height: '100%',
          minHeight: '100vh'
        }}
      >
        <Container //can change to box
          sx={{ width: "100%", height: "100vh"}}
        >
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: `${theme.palette.background.paper}`,
              borderLeft: `1px solid ${theme.palette.secondary.contrastText}`,
              borderRight: `1px solid ${theme.palette.secondary.contrastText}`,
              width: "100%",
              pt: 7,
              alignContent: "center",
              overflowY: 'hidden', 
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
