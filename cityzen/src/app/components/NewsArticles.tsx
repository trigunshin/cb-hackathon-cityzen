import React from 'react';
import { Card, Typography, Skeleton, CardMedia, Box, Stack, Divider, Link, Chip } from '@mui/material';
import { Grid } from '@mui/system';
import { ArticleMetadata } from '../utils/types';
import { useTheme } from '@mui/material/styles';

interface NewsArticlesProps {
  responseData: ArticleMetadata[];
  loading?: boolean;
}

const NewsArticles: React.FC<NewsArticlesProps> = ({ responseData, loading = false }) => {
  const theme = useTheme();

  const SkeletonArticle = () => (
    <Grid size={{xs: 12, md: 6, sm: 6}}>
      <Card variant='outlined' sx={{ height: '100%', width: '100%', border: `1px solid ${theme.palette.secondary.contrastText}`}}>
        <Skeleton variant="rectangular" height={150} />
        <Divider />
        <Stack gap={1} sx={{alignContent: 'center', padding: 2, backgroundColor: `${theme.palette.background.paper}`}}>
          <Skeleton variant="text" width="90%" height={24} />
          <Stack gap={2} direction={'column'} alignItems={'left'} alignContent={'space-between'}>
            <Skeleton variant="text" width="100%" height={60} />
            <Stack gap={1} direction={'row'} alignItems={'center'}>
              <Skeleton variant="rectangular" width={100} height={32} />
              <Skeleton variant="rectangular" width={100} height={32} />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <Box padding={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} gutterBottom>
        Here are some articles related to your search...
      </Typography>
      <Grid container spacing={2}>
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <SkeletonArticle key={`skeleton-${index}`} />
          ))
        ) : (
          responseData.map((article, index) => (
            <Grid size={{xs: 12, md: 6, sm: 6}} key={index}>
              <Card variant='outlined' sx={{ height: '100%', width: '100%', border: `1px solid ${theme.palette.secondary.contrastText}`}}>
                {<CardMedia
                  component="img"
                  height="70"
                  image={article.data.image}
                  alt={article.title}
                  sx={{
                    width: 'inherit',
                    objectFit: 'cover',
                    maxHeight: '150px'
                  }}
                />}
                <Divider />
                <Stack gap={1} sx={{alignContent: 'center', padding: 2, backgroundColor: `${theme.palette.background.paper}`}}>
                  <Link href={article.data.url} underline="hover">
                    <Typography variant="body1" color={theme.palette.text.secondary} sx={{textDecoration: 'underline'}}>
                      {article.data.title}
                    </Typography>
                  </Link>
                  <Stack gap={2} direction={'column'} alignItems={'left'} alignContent={'space-between'}>
                    <Typography variant="caption" color={theme.palette.text.secondary}>
                      {article.text?.slice(0, 100)}...
                    </Typography>
                    <Stack gap={1} direction={'row'} alignItems={'center'} divider={<Divider orientation="vertical" flexItem />}>
                      <Chip 
                        variant="outlined" 
                        sx={{ borderColor: theme.palette.text.secondary }}
                        label={
                          <Typography variant="caption" color={theme.palette.text.secondary}>
                            {article.data.date}
                          </Typography>
                        } 
                      />
                      <Chip 
                        variant="outlined" 
                        sx={{ borderColor: theme.palette.text.secondary}}
                        label={
                          <Typography variant="caption" color={theme.palette.text.secondary}>
                            {article.data.author || article.data.time || '06:30 PM'}
                          </Typography>
                        } 
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default NewsArticles;