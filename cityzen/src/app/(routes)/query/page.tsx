"use client"
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  NewsArticles,
  EventsResults,
  CityHallResults,
  MainContentResult,
} from "@/app/components";
import { DrawerMenu, drawerWidth } from "@/app/components/DrawerMenu";
import { QueryResponse } from "@/app/utils/types";
import { useCustomTheme } from "@/app/styles/theme";

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
    //store selected item in localStorage -- not sure if this is ideal?
    localStorage.setItem('selectedMenuItem', item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Main Content":
        return <MainContentResult data={content?.response} loading={loading} />;
      case "News Articles":
        return <NewsArticles responseData={content?.nodes} loading={loading} />;
      case "Events":
        return <EventsResults loading={loading} />;
      case "City Hall":
       return <CityHallResults loading={loading} />; 
      default:
        return (
          <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} height={'100%'} textAlign="center" alignContent={'center'} gutterBottom>
            Select an item from the menu to view content.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", overflowY: 'hidden'}}>
      <Tooltip title="Show menu" placement="right" arrow>
        <IconButton
          color='primary'
          aria-label="toggle drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            left: isLargeScreen ? (open ? drawerWidth : 16) : 16,
            top: 16,
            p: 1,
            transition: theme.transitions.create('left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            zIndex: 1200,
            visibility: open ? "hidden" : "visible",
            color: theme.palette.primary.contrastText,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>
      
      <DrawerMenu
        open={open}
        selectedItem={selectedItem}
        theme={theme}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerItem={handleDrawerItem}
        toggleTheme={toggleTheme}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: '100%',
          height: '100%',
          minHeight: '100vh'
        }}
      >
        <Box
          sx={{
            width: "100%",
            alignContent: "center",
            overflowY: 'hidden', 
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box 
            sx={{ 
              flexGrow: 1,
              width: '100%',
              pt: isLargeScreen ? 6 : (open ? 24 : 8),
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
        </Box>
      </Box>
    </Box>
  );
}