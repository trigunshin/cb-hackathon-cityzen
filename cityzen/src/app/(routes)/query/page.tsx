"use client"
import React, { useState } from 'react';
import { Box, Drawer, IconButton, List, ListItem, ListItemText, Button, Typography, Stack, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

export default function ContentPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
            {['Main Content', 'News Articles', 'Events', 'Voting Places', 'City Hall', ].map((text, index) => (
              <ListItem key={index} disablePadding>
                <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#B0B0B0' }}>
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
          transition: 'margin-left 0.3s',
          marginLeft: open ? 0 : `-${drawerWidth}px`,
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
        }}
      >
        <Container sx={{backgroundColor: '#B0B0B0', width: '100%', height: '100%'}}>
          <Typography variant="h6">
            Main content area
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}