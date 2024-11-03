"use client"
import React from 'react';
import { Typography, Box, Stack, Container, Paper } from '@mui/material';
import { useTheme } from '@mui/system';

function PrivacyPage() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Paper variant='outlined' style={{ border: `1px solid ${theme.palette.secondary.contrastText}`, backgroundColor: theme.palette.background.paper, padding: theme.spacing(3) }} elevation={0}>
        <Stack direction='column' spacing={5} textAlign="center" py={5}>
          <Typography variant="h2" color="textPrimary" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body1" color="textSecondary">
           text here
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default PrivacyPage;
