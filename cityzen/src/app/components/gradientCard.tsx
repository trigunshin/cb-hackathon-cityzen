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
  link: string | null;
}

interface GradientCardProps {
  section: SectionInfo;
  imagePlacement?: 'left' | 'right' | 'top' | 'bottom';
  button: boolean; 
}

const OVERLAP_WIDTH = '20%';
const OVERLAP_HEIGHT = 150;

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  margin: 'auto',
  zIndex: 2,
  //marginTop: theme.spacing(5),
  border: `1px solid ${theme.palette.secondary.contrastText}`,
  borderRadius: theme.spacing(3),
  overflow: 'visible',
  position: 'relative',
}));

const CardWrapper = styled(Box)<{ imageplacement?: string }>(({ theme, imageplacement = 'left' }) => ({
  position: 'relative',
  margin: 'auto',
  ...(imageplacement === 'left' && {
    paddingLeft: OVERLAP_WIDTH,
  }),
  ...(imageplacement === 'right' && {
    paddingRight: OVERLAP_WIDTH,
  }),
  ...(imageplacement === 'top' && {
    paddingTop: OVERLAP_HEIGHT,
  }),
  ...(imageplacement === 'bottom' && {
    paddingBottom: OVERLAP_HEIGHT,
  }),
}));

const ImagePlaceholder = styled(Paper)<{ imageplacement?: string }>(({ theme, imageplacement = 'left' }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.secondary.contrastText}`,
  position: 'absolute',
  zIndex: 3,

  ...(imageplacement === 'left' && {
    height: 250,
    width: '40%',
    left: '-20%',
    top: '50%',
    transform: 'translateY(-50%)',
  }),
  ...(imageplacement === 'right' && {
    height: 250,
    width: '40%',
    right: '-20%',
    top: '50%',
    transform: 'translateY(-50%)',
  }),
  ...(imageplacement === 'top' && {
    height: 200,
    width: '100%',
    left: 0,
    top: '-30%',
  }),
  ...(imageplacement === 'bottom' && {
    height: 200,
    width: '100%',
    left: 0,
    bottom: '-30%',
  }),
}));

const ReadMoreButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: `${theme.palette.text.primary}`,
  borderRadius: theme.spacing(2),
  padding: '8px 8px',
  width: 'auto',
}));

const GradientCard: React.FC<GradientCardProps> = ({ section, imagePlacement = 'left', button }) => {
  const theme = useTheme();

  const getContentSpacing = () => {
    switch (imagePlacement) {
      case 'left':
        return { pl: { sm: 4, lg: 18 }, pr: 3 };
      case 'right':
        return { pr: { sm: 4, lg: 18 }, pl: 3 };
      case 'top':
        return { px: 3, pt: { sm: 4, lg: 12 } };
      case 'bottom':
        return { px: 3, pb: { sm: 4, lg: 10 } };
      default:
        return { pl: { sm: 4, lg: 14 }, pr: 3 };
    }
  };

  return (
    <CardWrapper imageplacement={imagePlacement}>
      <StyledCard variant='outlined' elevation={0}>
        <CardContent sx={{ width: '100%', position: 'relative' }}>
          <Stack 
            direction={
              ['left', 'right'].includes(imagePlacement) 
                ? { xs: 'column', sm: 'row' } 
                : 'column'
            } 
            spacing={1}
          >
            <ImagePlaceholder elevation={10} imageplacement={imagePlacement}/>
            <Stack 
              flex={{ xs: '1', sm: '3' }} 
              spacing={2} 
              sx={{ 
                ...getContentSpacing(),
                paddingTop: 3, 
                width: '100%' 
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.description}
              </Typography>
              {button && (
                <ReadMoreButton variant="contained" disableElevation href={section.link || ""}>
                  read more
                </ReadMoreButton>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </StyledCard>
    </CardWrapper>
  );
};

export default GradientCard;
