"use client"
import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Grid, styled } from '@mui/system';
import { useTheme } from "@mui/system";
import Link from 'next/link';

const FlexibleChipContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  height: '100%',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  padding: theme.spacing(1),
}));

const ClickableChip = styled(Button)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  alignItems: 'center',
  alignContent: 'center',
  padding: theme.spacing(1.25, 2),
  //width: 'calc(33.333% - ' + theme.spacing(2) + 'px)', // 33.333% for 3 items minus gap
  //flex: '0 0 auto', // prevent growing and shrinking but allow basis auto
  border: `1px solid ${theme.palette.secondary.contrastText}`,
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
  },
  '&:active': {
    boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.2)',
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
    <FlexibleChipContainer container columns={3} spacing={2} justifyContent="space-between">
      {chips.map((chip, index) => (
        <Grid size={1} key={index}>
          <Link 
            href={`/query?question=${encodeURIComponent(chip)}`}
            passHref
            legacyBehavior
          >
            <ClickableChip 
              fullWidth 
              style={{
                background: 'background.paper',
                justifyContent: 'center',
                textTransform: 'none',
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={() => onChipClick && onChipClick(chip)}
            >
              <Typography variant="caption" color={theme.palette.text.primary}>{chip}</Typography>
            </ClickableChip>
          </Link>
        </Grid>
      ))}
    </FlexibleChipContainer>
  );
};


export default FlexibleChipStack;