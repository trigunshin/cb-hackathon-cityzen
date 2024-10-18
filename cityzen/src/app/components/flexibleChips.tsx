import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';

const FlexibleChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const ClickableChip = styled(Button)(({ theme }) => ({
  background: 'white',
  borderRadius: '20px',
  alignItems: 'center',
  alignContent: 'center',
  padding: theme.spacing(1.5, 2),
  maxWidth: '250px',
  border: '1px solid #868686',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#ebf7fe',
  },
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
    'Can you summarize the recent debate about homelessness policies in Los Angeles?',
    'What local events are happening in Echo Park this weekend?',
    'Have there been any changes to recycling policies in Los Angeles recently?'
  ]);

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
            <Typography variant="caption">{chip}</Typography>
          </ClickableChip>
        </Link>
      ))}
    </FlexibleChipContainer>
  );
};

export default FlexibleChipStack;