import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack, 
  Box,
  styled, 
  Paper
} from '@mui/material';
import { useTheme } from '@mui/system';

interface SectionInfo {
  title: string;
  description: string;
}

interface GradientCardProps {
  section: SectionInfo;
}

const OVERLAP_WIDTH = '20%';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  marginLeft: `calc(${OVERLAP_WIDTH} + auto)`,
  marginRight: 'auto',
  zIndex: '2',
  marginTop: theme.spacing(5),
  border: `1px solid ${theme.palette.secondary.contrastText}`,
  borderRadius: theme.spacing(3),
  overflow: 'visible',
  position: 'relative',
}));

const CardWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  position: 'relative',
  margin: 'auto',
  paddingLeft: OVERLAP_WIDTH,
}));

const ImagePlaceholder = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.secondary.contrastText}`,
  height: 250,
  width: '40%',
  position: 'absolute',
  left: '-20%',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
}));

const ReadMoreButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: 'white',
  borderRadius: 25,
  padding: '8px 24px',
}));

const GradientCard: React.FC<GradientCardProps> = ({ section }) => {
  const theme = useTheme();

  return (
    <CardWrapper>
      <StyledCard variant='outlined' elevation={0}>
        <CardContent sx={{ width: '100%', position: 'relative' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <ImagePlaceholder elevation={10}/>
            <Stack flex={{ xs: '1', sm: '3' }} spacing={2} sx={{ pl: { sm: 4, lg: 14 }, pr: 3, paddingTop: 3, width: '100%' }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.description}
              </Typography>
              <ReadMoreButton variant="contained" disableElevation>
                read more
              </ReadMoreButton>
            </Stack>
          </Stack>
        </CardContent>
      </StyledCard>
    </CardWrapper>
  );
};

export default GradientCard;