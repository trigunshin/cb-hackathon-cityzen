"use client"
import React from 'react';
import { Typography, Box, Stack, Container, Paper } from '@mui/material';
import { useTheme } from '@mui/system';

function AboutPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Paper variant='outlined' style={{ border: `1px solid ${theme.palette.secondary.contrastText}`, backgroundColor: theme.palette.background.paper, padding: theme.spacing(3) }} elevation={0}>
        <Stack direction='column' spacing={5} textAlign="center" py={5}>
          <Typography variant="h2" color="textPrimary" gutterBottom>
            About Metrall
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Metrall is a platform dedicated to providing updated and reliable news about your city. Integrating 
            different sources and leveraging advanced technologies to bring information and services closer to our users.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default AboutPage;
