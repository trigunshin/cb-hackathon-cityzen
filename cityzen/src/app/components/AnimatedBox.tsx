import React, { ReactNode, useRef } from "react";
import { Box, BoxProps } from "@mui/material";
import { motion, useInView } from "framer-motion";

interface AnimatedBoxProps extends BoxProps {
  children: ReactNode;
  animationProps?: {
    duration?: number;
    ease?: string | [number, number, number, number];
    delay?: number;
  };
}

const AnimatedBox: React.FC<AnimatedBoxProps> = ({ children, animationProps, sx, ...rest }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { margin: "-50px", once: true });

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}} 
      transition={{
        duration: 0.5, 
        ease: "easeOut",
        ...animationProps,
      }}
      sx={{
        ...sx, 
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedBox;
