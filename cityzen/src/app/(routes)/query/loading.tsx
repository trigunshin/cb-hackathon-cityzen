"use client"
import { Box, useMediaQuery, IconButton, Tooltip } from "@mui/material";
import { MainContentResult, NewsArticles, EventsResults, CityHallResults } from "@/app/components";
import { DrawerMenu, drawerWidth } from "@/app/components/DrawerMenu";
import { useCustomTheme } from "@/app/styles/theme";
import { useSearchParams } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function Loading() {
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useCustomTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(true);
  // Get selectedItem from URL or default to "Main Content"
  const selectedItem = searchParams.get("view") || "Main Content";

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Drawer items won't be clickable during loading, so this is a no-op
  const handleDrawerItem = (item: string) => {};

  const renderLoadingContent = () => {
    switch (selectedItem) {
      case "Main Content":
        return <MainContentResult data="" loading={true} />;
      case "News Articles":
        return <NewsArticles responseData={[]} loading={true} />;
      case "Events":
        return <EventsResults loading={true} />;
      case "City Hall":
        return <CityHallResults loading={true} />;
      default:
        return <MainContentResult data="" loading={true} />;
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
            {renderLoadingContent()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}