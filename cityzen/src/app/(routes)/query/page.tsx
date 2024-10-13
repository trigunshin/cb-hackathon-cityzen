"use client"
import React, { useState } from 'react';
import { Box, Drawer, IconButton, List, ListItem, ListItemText, Button, Typography, Stack, Container, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import NewsArticles from '@/app/components/NewsArticles';
import EventsResults from '@/app/components/EventsResults';
import VotingPolls from '@/app/components/VotingPolls';

const drawerWidth = 240;

const menuItems = ['Main Content', 'News Articles', 'Events', 'Voting Places', 'City Hall'];

export default function ContentPage() {
  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState('Main Content');
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerItem = (item: string) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'Main Content':
        return <Typography>This is the Main Content area.</Typography>;
      case 'News Articles':
        return <NewsArticles />
      case 'Events':
        return <EventsResults />
      case 'Voting Places':
        return <VotingPolls />
      case 'City Hall':
        return <Typography>Information about City Hall and local government.</Typography>;
      default:
        return <Typography>Select an item from the menu to view content.</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        edge="end"
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          left: open ? drawerWidth : 0,
          top: 0,
          p: 2,
          transition: 'left 0.3s'
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative'
          }
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <IconButton
            color="inherit"
            aria-label="back button"
            onClick={() => router.push('/')}
            sx={{ m: 1 }}
          >
            <ArrowBackIcon /> Back
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="show drawer"
            onClick={handleDrawerToggle}
            sx={{ m: 1 }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
        <Box sx={{ overflow: 'auto', height: '100%', backgroundColor: '#ffffff' }}>
          <List sx={{ alignContent: 'space-around', height: '100%' }}>
            {menuItems.map((text, index) => (
              <ListItem key={index} disablePadding>
                <Button
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    color: selectedItem === text ? 'primary.main' : '#B0B0B0',
                    backgroundColor: selectedItem === text ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  }}
                  onClick={() => handleDrawerItem(text)}
                >
                  <ListItemText>
                    {text}
                  </ListItemText>
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#B0B0B0',
          transition: 'margin-left 0.3s',
          marginLeft: open ? 0 : `-${drawerWidth}px`,
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
        }}
      >
        <Container sx={{width: '100%', height: '100%', alignContent: 'center'}}>
        <Paper
            elevation={3}
            sx={{
                backgroundColor: '#ffffff',
                width: '100%',
                alignContent: 'center',
                p: 4,
                boxSizing: 'border-box', // Ensures padding is included in the height calculation
            }}
        >            
            {renderContent()}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}