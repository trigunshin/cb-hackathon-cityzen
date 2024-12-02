"use client";

import { Typography, Box, styled } from "@mui/material";
import { useTheme } from "@mui/system";
import React, { useRef, useEffect } from "react";

interface ScrollingChipsProps {
  questions: string[];
}

const getRandomAngle = () => `${Math.floor(Math.random() * 360)}deg`;

// ScrollingContainer styled with fixed gradients
const ScrollingContainer = styled(Box)(({ theme }) => `
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;

    /* Top Gradient */
    &::before {
        content: '';
        position: fixed; /* Fixed relative to the viewport */
        top: 0;
        left: 0;
        width: 100%;
        height: 10%; 
        background: linear-gradient(
            to bottom,
            ${theme.palette.background.paper} 0%,
            transparent 100%
        );
        pointer-events: none;
        z-index: 2;
    }

    /* Bottom Gradient */
    &::after {
        content: '';
        position: fixed; /* Fixed relative to the viewport */
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10%; 
        background: linear-gradient(
            to top,
            ${theme.palette.background.paper} 0%,
            transparent 100%
        );
        pointer-events: none;
        z-index: 2;
    }

    .scrolling-content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        z-index: 1; /* Content scrolls beneath the gradients */
    }
`);

// GradientChip with theme-based styles and dynamic angle
const GradientChip = styled(Box)(({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin: ${theme.spacing(.5)};

    border: 1px solid transparent;
    border-radius: ${theme.spacing(2)};
    background: linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(
            ${getRandomAngle()},
            ${theme.palette.background.default},
            ${theme.palette.primary.main},
            ${theme.palette.secondary.light}
        ) border-box;
    animation: rotate 12s linear infinite;
    --angle: 360deg;

    @keyframes rotate {
        to {
            --angle: 0deg;
        }
    }
`);

const ScrollingChips: React.FC<ScrollingChipsProps> = ({ questions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    let startTime: number | null = null;
    const scrollSpeed = 50; // Adjust speed as needed

    const animateScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const distance = (elapsed / 1000) * scrollSpeed;

      if (distance >= content.offsetHeight) {
        startTime = timestamp;
        container.scrollTop = 0;
      } else {
        container.scrollTop = distance;
      }

      requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);

    return () => {
      startTime = null;
    };
  }, []);

  return (
    <ScrollingContainer ref={containerRef}>
      <Box className="scrolling-content" ref={contentRef}>
        {questions.reduce((acc, question, index) => {
          const row = Math.floor(index / 2);
          if (!acc[row]) {
            acc[row] = [];
          }
          acc[row].push(
            <GradientChip key={index}>
              <Typography variant="caption" color="textSecondary" align="right">
                {question}
              </Typography>
            </GradientChip>
          );
          return acc;
        }, []).map((chips, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
            {chips}
          </Box>
        ))}
        {/* Duplicate content for seamless looping */}
        {questions.reduce((acc, question, index) => {
          const row = Math.floor(index / 2);
          if (!acc[row]) {
            acc[row] = [];
          }
          acc[row].push(
            <GradientChip key={`duplicate-${index}`}>
              <Typography variant="caption" color="textSecondary" align="right">
                {question}
              </Typography>
            </GradientChip>
          );
          return acc;
        }, []).map((chips, rowIndex) => (
          <Box key={`duplicate-${rowIndex}`} sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', flexWrap: 'wrap' }}>
            {chips}
          </Box>
        ))}
      </Box>
    </ScrollingContainer>
  );
};

export default ScrollingChips;
