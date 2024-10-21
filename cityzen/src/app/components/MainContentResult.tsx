import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useState } from "react";

const sources = {
  data: {
    sources: [
      "Source 1?",
      "Source 2?",
      "Source 3?",
    ]
  }
};

const MainContentResult = ({ data }: any) => {
  const [text, setText] = useState("");
  const theme = useTheme();

  const sourceslist = sources.data;

  return (
    <Box padding={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}} alignContent={'center'} height={'100%'}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} gutterBottom>
        Here's a summary of the information we analyzed regarding your question...
      </Typography>
      <Typography
        padding={2}
        variant="body2"
        color={theme.palette.text.secondary}
      >
        {data}
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, my: 2, borderRadius: 2, border: `1px solid ${theme.palette.primary.contrastText}` }}>
        <Stack gap={1} p={2} direction={'column'}>
          <Typography variant="body1" color={theme.palette.text.secondary} gutterBottom>
            Information about this summary:
          </Typography>
          <Typography variant="caption"color={theme.palette.text.secondary} gutterBottom>
            *some info here*
          </Typography>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            {sourceslist.sources.map((source: string, index: number) => (
              <div key={index}>{source}</div>
            ))}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MainContentResult;
