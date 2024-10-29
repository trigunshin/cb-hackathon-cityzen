import React from "react";
import {
  Drawer,
  IconButton,
  Button,
  Typography,
  Stack,
  Divider,
  ButtonGroup,
  Tooltip,
  useMediaQuery,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import EventIcon from '@mui/icons-material/Event';
import FeedIcon from '@mui/icons-material/Feed';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ShareIcon from '@mui/icons-material/Share';
import { Theme } from "@mui/material/styles";

const drawerWidth = 240;
const menuItems = [
  {name: "Main Content", icon: <LocationCityIcon />},
  {name: "News Articles", icon: <NewspaperIcon />},
  {name: "Events", icon: <EventIcon />},
  {name: "City Hall", icon: <FeedIcon />}
];

interface DrawerMenuProps {
  open: boolean;
  selectedItem: string;
  theme: Theme;
  handleDrawerToggle: () => void;
  handleDrawerItem: (item: string) => void;
  toggleTheme: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  open,
  selectedItem,
  theme,
  handleDrawerToggle,
  handleDrawerItem,
  toggleTheme,
}) => {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const DesktopDrawer = () => (
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
        <Link 
          variant="h3"
          paddingX={2}
          paddingY={1}
          className="jaro"
          underline="none"
          href='/'
        >
          Metrall
        </Link>
        <Tooltip title="Hide menu" placement="right" arrow>
          <Button
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
          <Tooltip title="Toggle theme" placement="right" arrow>
            <IconButton
              aria-label="switch mode"
              onClick={toggleTheme}
              sx={{ m: 1, gap: 1, color: `${theme.palette.primary.contrastText}` }}
              size="small"
            >
              <Brightness4Icon /> 
            </IconButton>
          </Tooltip>
          <Tooltip title="Share" placement="right" arrow>
            <IconButton
              aria-label="share"
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

  const MobileDrawer = () => (
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
          <Link href='/' underline='none' variant="h3" className="jaro" sx={{ paddingLeft: 1, color: theme.palette.primary.contrastText }}>
            Metrall
          </Link>
          <Stack direction={'row'} spacing={1}>
            <Tooltip title="Toggle mode" placement="bottom" arrow>
              <IconButton
                aria-label="Toggle mode"
                onClick={toggleTheme}
                sx={{ color: `${theme.palette.primary.contrastText}` }}
                size="small"
              >
                <Brightness4Icon /> 
              </IconButton>
            </Tooltip>
            <Tooltip title="Share" placement="bottom" arrow>
              <IconButton
                aria-label="share"
                size="small"
                sx={{ m: 1, gap: 1, color: `${theme.palette.primary.contrastText}` }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hide menu" placement="bottom-start" arrow>
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
        <Stack direction="row">
          <ButtonGroup
            variant='outlined'
            fullWidth
            sx={{ flexWrap: 'wrap', height: "100%", justifyContent: 'center'}}
          >
            {menuItems.map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={() => handleDrawerItem(item.name)}
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
  );

  return isLargeScreen ? <DesktopDrawer /> : <MobileDrawer />;
};

export { drawerWidth };