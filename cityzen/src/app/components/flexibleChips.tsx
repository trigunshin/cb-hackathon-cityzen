"use client"
import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from "@mui/system";
import Link from 'next/link';

const FlexibleChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const ClickableChip = styled(Button)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  alignItems: 'center',
  alignContent: 'center',
  padding: theme.spacing(1.25, 2),
  maxWidth: '250px',
  //width: '100%',
  border: `1px solid ${theme.palette.secondary.contrastText}`,
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', //soft shadow for depth
  },
  '&:active': {
    boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.2)', //inset shadow for click effect
  }
}));


interface FlexibleChipStackProps {
  initialChips?: string[];
  onChipClick?: (chip: string) => void;
}

const FlexibleChipStack: React.FC<FlexibleChipStackProps> = ({ 
  initialChips = [],
  onChipClick = () => {},
}) => {
  const [chips] = useState<string[]>(initialChips.length > 0 ? initialChips : [
    'Summarize the recent debate about homelessness policies in Los Angeles.',
    'What local events are happening in Echo Park this weekend?',
    'Have there been any changes to recycling policies in Los Angeles recently?'
  ]);
  const theme = useTheme();

  return (
    <FlexibleChipContainer>
      {chips.map((chip, index) => (
        <Link 
          key={index} 
          href={`/query?question=${encodeURIComponent(chip)}`}
          passHref
          legacyBehavior
        >
          <ClickableChip as="a" onClick={() => onChipClick && onChipClick(chip)}>
            <Typography variant="caption" color={theme.palette.text.secondary}>{chip}</Typography>
          </ClickableChip>
        </Link>
      ))}
    </FlexibleChipContainer>
  );
};

export default FlexibleChipStack;