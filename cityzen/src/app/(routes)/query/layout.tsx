"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSearchParams } from "next/navigation";
import { DrawerMenu, drawerWidth } from "@/app/components/DrawerMenu";
import ContentPage from "./page";
import { LoadingProps, QueryResponse } from "@/app/utils/types";
import Loading from "./loading";
import { useTheme } from "@mui/system";

const QueryLayout: React.FC = ({  }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState("Main Content");
  const [content, setContent] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleDrawerItem = (item: string) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const query = searchParams.get("question");
    if (!query) return;

    const storedQuestion = JSON.parse(localStorage.getItem(query) || "null");
    if (storedQuestion) {
      setContent(storedQuestion);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}query?query=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error during fetch:", error);
      });
  }, [searchParams]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
        <body>
        <Box sx={{ display: "flex", height: "100%", overflowY: "hidden",}}>
          <Tooltip title="Show menu" placement="right" arrow>
            <IconButton
              aria-label="toggle drawer"
              onClick={() => setOpen(!open)}
              sx={{
                position: "fixed",
                left: isLargeScreen ? (open ? drawerWidth : 16) : 16,
                top: 16,
                zIndex: 1200,
                visibility: open ? "hidden" : "visible",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <DrawerMenu
            open={open}
            selectedItem={selectedItem}
            theme={theme}
            handleDrawerToggle={() => setOpen(!open)}
            handleDrawerItem={handleDrawerItem}
            toggleTheme={() => {}}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: theme.palette.background.default,
              width: "100%",
              minHeight: "100vh",
              transition: theme.transitions.create(["padding"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              paddingTop: !isLargeScreen && open ? "200px" : 0, //only applies padding on mobile... broken
            }}
          >
            <Suspense fallback={<Loading content={selectedItem as LoadingProps["content"]} />}>
              <ContentPage selectedItem={selectedItem} content={content} loading={loading} />
            </Suspense>
          </Box>
        </Box>
    </body>
    </html>
  );
};

export default QueryLayout;
