import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const FlexibleChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const SpeechBubbleChip = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '20px',
  padding: theme.spacing(1.5, 2),
  maxWidth: '250px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '20px',
    borderWidth: '10px 10px 0',
    borderStyle: 'solid',
    borderColor: 'white transparent',
  },
}));

interface FlexibleChipStackProps {
  initialChips?: string[];
}

const FlexibleChipStack: React.FC<FlexibleChipStackProps> = ({ initialChips = [] }) => {
  const [chips] = useState<string[]>(initialChips.length > 0 ? initialChips : [
    'Can you summarize the recent debate about homelessness policies in Los Angeles?',
    'What local events are happening in Echo Park this weekend?',
    'Have there been any changes to recycling policies in Los Angeles recently'
  ]);

  return (
    <FlexibleChipContainer>
      {chips.map((chip, index) => (
        <SpeechBubbleChip key={index} textAlign={'center'} alignContent={'center'}>
          <Typography variant="body1" fontSize={'12px'}>{chip}</Typography>
        </SpeechBubbleChip>
      ))}
    </FlexibleChipContainer>
  );
};

export default FlexibleChipStack;