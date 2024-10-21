"use client"
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Drawer,
  IconButton,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  useMediaQuery,
  ButtonGroup,
  Slide,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import EventIcon from '@mui/icons-material/Event';
import FeedIcon from '@mui/icons-material/Feed';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShareIcon from '@mui/icons-material/Share';
import {
  NewsArticles,
  EventsResults,
  CityHallResults,
  MainContentResult,
} from "@/app/components";
import { getArticleData } from "@/app/utils/getArticles";
import { QueryResponse } from "@/app/utils/types";
import { useCustomTheme } from "@/app/styles/theme";

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
        return <EventsResults/>;
      case "City Hall":
        // return <CityHallResults data={getCityVideoData(data, 5)} />;
        return <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} height={'100%'} textAlign="center" alignContent={'center'} gutterBottom>Select an item from the menu to view content.</Typography>;
      default:
        return (
          <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} height={'100%'} textAlign="center" alignContent={'center'} gutterBottom>Select an item from the menu to view content.</Typography>
        );
    }
  };

  const MenuDrawer = () => (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.secondary.contrastText}`,
          transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent='space-between'
        alignItems="center"
        sx={{ width: "100%", backgroundColor: `${theme.palette.primary.main}` }}
      >
        <Typography 
          variant="h3"
          paddingX={2}
          paddingY={1}
          className="jaro"
        >
            Metrall
        </Typography>
        <Tooltip title="Hide menu"  placement="right" arrow>
        <Button
          color={theme.palette.primary.contrastText}
          size='small'
          aria-label="show drawer"
          onClick={handleDrawerToggle}
          sx={{ minWidth: 0, p: 1, borderRadius: 0, color: `${theme.palette.primary.contrastText}` }}
        >
          <ArrowForwardIcon />
        </Button>
        </Tooltip>
      </Stack>
      <Divider sx={{ bgcolor: "secondary.contrastText" }} />
      <Stack
        sx={{ overflow: "auto", height: "100%", backgroundColor: `${theme.palette.background.paper}`}}
      >
        <ButtonGroup
          orientation="vertical"
          variant='text'
          fullWidth
          sx={{ height: "100%", justifyContent: 'center'}}
        >
          {menuItems.map((item, index) => (
            <Button
              key={index}
              size="large"
              sx={{
                borderRadius: 0,
                pl: 3,
                py: 2,
                justifyContent: "left",
                width: '100%',
                color: selectedItem === item.name ?  `${theme.palette.primary.light}` : `${theme.palette.text.secondary}`,
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
      <Stack>
      <Button
        size="large"
        aria-label="back"
        // onClick={}
        startIcon={<ArrowBackIcon />}
        sx={{
          borderRadius: 0,
          justifyContent: "center",
          width: '100%',
          height: '50px'
        }}     
        >
          <Typography>Ask another question</Typography>
      </Button>
      <Divider sx={{ bgcolor: "secondary.contrastText" }}  />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%", backgroundColor: `${theme.palette.primary.main}` }}
      >
        <Tooltip title="Toggle theme"  placement="right" arrow>
        <IconButton
          aria-label="switch mode"
          onClick={toggleTheme}
          sx={{ m: 1, gap: 1, color: `${theme.palette.primary.contrastText}` }}
          size="small"
        >
          <Brightness4Icon /> 
        </IconButton>
        </Tooltip>
        <Tooltip title="Share"  placement="right" arrow>
        <IconButton
          aria-label="share"
          //onClick={}
          sx={{ m: 1, gap: 1, color: `${theme.palette.primary.contrastText}` }}
          size="small"
          >
            <ShareIcon />
        </IconButton>
        </Tooltip>
      </Stack>
      </Stack>
    </Drawer>
  );

  const MobileMenu = () => (
    //<Slide direction="down" in={open} mountOnEnter unmountOnExit>
      <Drawer
        open={open}
        variant="persistent"
        anchor='top'
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.secondary.contrastText}`,
        }}
      >
        <Stack direction="column" sx={{ width: '100%' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ 
              width: "100%", 
              backgroundColor: theme.palette.primary.main,
              padding: 1
            }}
          >
            <Typography variant="h3" className="jaro" sx={{ paddingLeft: 1, color: theme.palette.primary.contrastText }}>
              Metrall
            </Typography>
            <Stack direction={'row'} spacing={1}>
              <Tooltip title="Toggle mode"  placement="bottom" arrow>
                <IconButton
                  aria-label="Toggle mode"
                  onClick={toggleTheme}
                  sx={{ color: `${theme.palette.primary.contrastText}` }}
                  size="small"
                >
                  <Brightness4Icon /> 
                </IconButton>
              </Tooltip>
              <Tooltip title="Share"  placement="bottom" arrow>
                <IconButton
                  aria-label="share"
                  size="small"
                  //onClick={}
                  sx={{ m: 1, gap: 1, color: `${theme.palette.primary.contrastText}` }}
                  >
                    <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Hide menu"  placement="bottom-start" arrow>
                <IconButton
                  aria-label="Close menu"
                  size="small"
                  onClick={handleDrawerToggle}
                  sx={{ color: theme.palette.primary.contrastText }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Divider sx={{ bgcolor: "secondary.contrastText" }} />
          <Stack direction="row" >
          <ButtonGroup
              variant='outlined'
              fullWidth
              sx={{ flexWrap: 'wrap', height: "100%", justifyContent: 'center'}}
            >
            {menuItems.map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={() => {
                  handleDrawerItem(item.name);
                  //handleDrawerToggle();
                }}
                sx={{
                  flexGrow: 1,
                  justifyContent: "center",
                  width: '100%',
                  borderRadius: 0,
                  flexBasis: '50%',
                  padding: 3,
                  color: selectedItem === item.name ?  `${theme.palette.primary.light}` : `${theme.palette.text.secondary}`,
                  backgroundColor:
                    selectedItem === item.name
                      ? "rgba(0, 0, 0, 0.2)"
                      : "transparent",
                }}
              >
                <Typography variant="caption">
                  {item.name}
                </Typography>
              </Button>
            ))}
            </ButtonGroup>
          </Stack>
        </Stack>
      </Drawer>
    //</Slide>
  );

  return (
    <Box sx={{ display: "flex", height: "100%", overflowY: 'hidden'}}>
      <Tooltip title="Show menu"  placement="right" arrow>
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
      {isLargeScreen ? <MenuDrawer /> : <MobileMenu />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          //marginLeft: isLargeScreen && open ? drawerWidth : 0,
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
          )}
        </Box>
      </Box>
    </Box>
  );
}