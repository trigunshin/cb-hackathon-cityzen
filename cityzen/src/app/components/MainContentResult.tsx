import { Box, Typography } from "@mui/material";
import React, { useState } from "react";

const MainContentResult = ({ data }: any) => {
  const [text, setText] = useState("");

  return (
    <>
      <Typography fontSize={"18px"} paddingY={2} color="#868686" gutterBottom>
        A summary of the information we analyzed relating to your question...
      </Typography>
      <Box sx={{ padding: 1 }}>
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
