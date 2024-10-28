"use client"
import { Box, useMediaQuery } from "@mui/material";
import { MainContentResult, NewsArticles, EventsResults, CityHallResults } from "@/app/components";
import { useCustomTheme } from "@/app/styles/theme";
import { useEffect, useState } from "react";

export default function Loading() {
  const { theme } = useCustomTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [selectedItem, setSelectedItem] = useState("Main Content");
  const [open, setOpen] = useState(true);

  //get the selected menu item from localStorage
  useEffect(() => {
    const storedItem = localStorage.getItem('selectedMenuItem');
    if (storedItem) {
      setSelectedItem(storedItem);
    }
  }, []);

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
      // default:
      //   return <MainContentResult data="" loading={true} />;
    }
  };

  return (
    <Box 
      sx={{ flexGrow: 1, width: '100%', pt: isLargeScreen ? 6 : (open ? 24 : 8),
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
  );
}