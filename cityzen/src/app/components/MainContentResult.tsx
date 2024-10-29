"use client"
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import React from "react";

const sources = {
  data: {
    sources: [
      "Source 1?",
      "Source 2?",
      "Source 3?",
    ]
  }
};

interface MainContentResultProps {
  data: string;
  loading?: boolean;
}

const MainContentResult = ({ data, loading = false }: MainContentResultProps) => {
  const theme = useTheme();
  
  const sourceslist = sources.data;
  
  if (loading) {
    return (
      <Stack gap={2} paddingY={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}} alignContent={'center'} height={'100%'}>
        <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 4 }} />
        <Paper variant="outlined" sx={{ p: 2, my: 2, borderRadius: theme.spacing(2), border: `1px solid ${theme.palette.primary.contrastText}` }}>
          <Stack gap={1} p={2} direction={'column'}>
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="text" width="90%" height={20} />
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} variant="text" width="40%" height={20} />
            ))}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack gap={1} paddingY={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}} alignContent={'center'} height={'auto'}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary}>
        Here's a summary of the information we analyzed regarding your question...
      </Typography>
      <Stack gap={3}>
      <Typography
        variant="body2"
        color={theme.palette.text.secondary}
      >
        {data}
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: theme.spacing(2), border: `1px solid ${theme.palette.primary.contrastText}` }}>
        <Stack gap={1} p={2} direction={'column'}>
          <Typography variant="body1" color={theme.palette.text.secondary} gutterBottom>
            Information about this summary:
          </Typography>
          <Typography variant="caption" color={theme.palette.text.secondary} gutterBottom>
            *some info here*
          </Typography>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            {sourceslist.sources.map((source: string, index: number) => (
              <div key={index}>{source}</div>
            ))}
          </Typography>
        </Stack>
      </Paper>
      </Stack>
    </Stack>
  );
};

export default MainContentResult;