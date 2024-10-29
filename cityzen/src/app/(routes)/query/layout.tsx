"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSearchParams } from "next/navigation";
import { DrawerMenu, drawerWidth } from "@/app/components/DrawerMenu";
import ContentPage from "./page";
import { LoadingProps, QueryResponse } from "@/app/utils/types";
import Loading from "./loading";
import { useTheme } from '@mui/system';
import Footer from "@/app/components/Footer";

const QueryLayout: React.FC = ({  }) => {
  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Main Content");
  const [content, setContent] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

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

  const handleDrawerItem = (item: string) => {
    setSelectedItem(item);
  };

  return (
        <Box sx={{ display: "flex", height: "100%", overflowY: "hidden",}}>
          <Tooltip title="Show menu" placement="right" arrow>
            <IconButton
              aria-label="toggle drawer"
              onClick={() => setOpen(!open)}
              sx={{
                position: "fixed",
                left: isLargeScreen ? (open ? drawerWidth : 16) : 16,
                top: 16,
                zIndex: 10,
                visibility: open ? "hidden" : "visible",
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.background.default,
                "&:hover, &.Mui-focusVisible": { backgroundColor: theme.palette.primary.light }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <DrawerMenu
            open={open}
            selectedItem={selectedItem}
            handleDrawerToggle={() => setOpen(!open)}
            handleDrawerItem={handleDrawerItem}
          />

          <Box
            component="main"
            sx={{
              width: '100%',
              minHeight: "100vh",
              flexGrow: 1,
              backgroundColor: theme.palette.background.default,
              transition: theme.transitions.create(["margin", "width", "padding"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              paddingTop: !isLargeScreen && open ? "200px" : 0,
              marginLeft: isLargeScreen && !open ? `-${drawerWidth}px` : 0,
            }}
          >
            <Suspense fallback={<Loading content={selectedItem as LoadingProps["content"]} />}>
              <ContentPage selectedItem={selectedItem} content={content} loading={loading} />
            </Suspense>
          </Box>
        </Box>
  );
};

export default QueryLayout;
