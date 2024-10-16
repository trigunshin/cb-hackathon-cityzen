import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

const MainContentResult = ({ data }: any) => {
  const [text, setText] = useState("");

  return (
    <>
      <Box padding={{lg: 2, xl: 2, md: 2, sm: 0, xs: 0}}>
      <Typography fontSize={"18px"} paddingY={2} color="#868686" gutterBottom>
        Here's a summary of the information we analyzed regarding your question...
      </Typography>
        <Typography
          key={1}
          variant="body1"
          component="p"
          sx={{ lineHeight: 2 }}
          color="#868686"
        >
          {data}
        </Typography>
      </Box>
    </>
  );
};

export default MainContentResult;
