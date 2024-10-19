import React, { useState } from 'react';
import { Card, CardContent, Typography, Skeleton, CardActions, Button, CardMedia, CircularProgress, Box, Stack, Collapse, Divider, Link, Chip } from '@mui/material';
import { Grid } from '@mui/system';
import { ArticleMetadata } from '../utils/types';
import { useTheme } from '@mui/material/styles';

const NewsArticles: React.FC<ArticleMetadata> = ({responseData}) => {
  const [articles, setArticles] = useState();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  
  //Turning this off, untill we need to refetch the data 
  // useEffect(() => {
  //     setLoading(true);
  //     fetchArticleData().then((data: JsonData) => {
  //         const extractedArticles = getArticleData(data, 9);
  //         setArticles(extractedArticles);
  //         setLoading(false);
  //     });
  // }, []);

  // function removeDuplicates(responseData: ArticleMetadata[]) {
  //   const uniqueArticles = new Map();
  //   responseData.forEach(article => {
  //       if (!uniqueArticles.has(article.data.source)) {
  //           uniqueArticles.set(article.data.source, article);
  //       }
  //   });
  //   return Array.from(uniqueArticles.values());
  // }
  // const uniqueResponseData = removeDuplicates(responseData);

  if (loading) {
    return (
      <Box padding={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} gutterBottom>
        Here are some articles related to your search...
      </Typography>
      <Grid container spacing={2}>
        {responseData.map((article, index) => (
          <Grid size={{xs: 12, md: 6, sm: 6}} key={index}>
            <Card variant='outlined' sx={{ height: '100%', width: '100%', border: `1px solid ${theme.palette.secondary.contrastText}`,}}>
              {
                <CardMedia
                  component="img"
                  height="70"
                  image={article.data.image}
                  alt={article.title}
                  sx={{    width: 'inherit',
                    objectFit: 'cover',
                    maxHeight: '150px'}}
                />}
              <Divider />
              <Stack gap={1} sx={{alignContent: 'center', padding: 2, backgroundColor: `${theme.palette.background.paper}`,  }}>
                <Link href={article.data.url} underline="hover">
                  <Typography variant="body1" color={theme.palette.text.secondary} sx={{textDecoration: 'underline'}}>
                    {article.data.title}
                  </Typography>
                </Link>
                <Stack gap={2} direction={'column'} alignItems={'left'} alignContent={'space-between'}>
                  <Typography variant="caption" color={theme.palette.text.secondary}>
                  {article.text?.slice(0, 100)}...
                  </Typography>
                <Stack gap={1} direction={'row'} alignItems={'center'} divider={ <Divider orientation="vertical" flexItem />}>
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
        ))}
      </Grid>
    </Box>
  );
};

export default NewsArticles;