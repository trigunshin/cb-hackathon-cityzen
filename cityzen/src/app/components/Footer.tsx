"use client"
import React, { useState, useEffect } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Grid, styled } from '@mui/system';
import Link from 'next/link';

const StyledFooter = styled(Box)(({ theme }) => ({
  width: '100%',
  bottom: 0,
  position: 'fixed',
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
  borderTop: `1px solid ${theme.palette.secondary.contrastText}`,
  transition: 'transform 0.3s ease-in-out',
}));

const footerLinks = [
  {
    section: 'Learn More',
    links: [
      { name: 'About Us', url: '/about' },
      { name: 'Terms of Service', url: '/terms' },
      { name: 'Privacy Policy', url: '/privacy' },
    ],
  },
  {
    section: 'Other Links',
    links: [
      { name: 'link #1', url: '/link1' },
      { name: 'link #2', url: '/link2' },
      { name: 'link #3', url: '/link3' },
    ],
  },
];

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    // Check if the user has scrolled to the bottom of the document
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <StyledFooter style={{ transform: isVisible ? 'translateY(0)' : 'translateY(100%)' }}>
      <Grid container columns={3}>
        <Grid size={{xs: 3, sm: 1}} alignContent={'center'}>
          <Typography variant="h2" className='jaro-noshade' style={{ fontWeight: 'bold' }}>
            Metrall
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
        <Grid 
            container 
            size={{xs: 3, sm: 1}}
            alignItems='center' 
            padding={2}
            >
            {footerLinks.map((section, index) => (
                <Grid size={{xs: 3, sm: 1}} key={section.section} sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: index === 0 ? 'flex-start' : 'flex-end'  // This ensures the Stack itself is positioned correctly
                  }}>
                <Stack
                    direction="column"
                    spacing={2}
                    alignItems={index === 0 ? 'flex-start' : 'flex-end'}
                >
                    {section.links.map(link => (
                    <Link 
                        key={link.name} 
                        href={link.url} 
                        passHref 
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography variant="caption">{link.name}</Typography>
                    </Link>
                    ))}
                </Stack>
                </Grid>
            ))}
        </Grid>
        <Divider orientation="vertical" fullWidth flexItem sx={{ bgcolor: "secondary.contrastText" }} />
      </Grid>
    </StyledFooter>
  );
};

export default Footer;

