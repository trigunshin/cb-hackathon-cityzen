import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useState } from "react";

const MainContentResult = ({ data }: any) => {
  const [text, setText] = useState("");
  const theme = useTheme();

  return (
    <>
      <Box padding={{lg: 4, xl: 4, md: 3, sm: 3, xs: 3}} alignContent={'center'} height={'100%'}>
        <Typography variant="h3" padding={2} color={theme.palette.text.primary} gutterBottom>
          Here's a summary of the information we analyzed regarding your question...
        </Typography>
        <Typography
          padding={2}
          variant="body2"
          color={theme.palette.text.secondary}
        >
          {data}
        </Typography>
      </Box>
    </>
  );
};

export default MainContentResult;
