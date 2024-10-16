import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, CardMedia, CircularProgress, Box, Stack, Collapse, Divider, Link, Chip } from '@mui/material';
import { Grid } from '@mui/system';
import { ArticleMetadata } from '../utils/types';


const NewsArticles: React.FC<ArticleMetadata> = ({responseData}) => {
  const [articles, setArticles] = useState();
  const [loading, setLoading] = useState(false);
  
  //Turning this off, untill we need to refetch the data 
  // useEffect(() => {
  //     setLoading(true);
  //     fetchArticleData().then((data: JsonData) => {
  //         const extractedArticles = getArticleData(data, 9);
  //         setArticles(extractedArticles);
  //         setLoading(false);
  //     });
  // }, []);
  

  if (loading) {
    return (
      <Box padding={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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

  return (
    <Box padding={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}}>
      <Typography fontSize={'18px'} padding={2} color='#868686' gutterBottom={true}>
        Here are some articles related to your search...
      </Typography>
      <Grid container spacing={2}>
        {responseData.map((article, index) => (
          <Grid size={{xs: 12, md: 6, sm: 6}} key={index}>
            <Card variant='outlined' sx={{ height: '100%', width: '100%' }}>
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
              <Box sx={{alignContent: 'center', padding: 2}}>
                <Link href={article.data.url} underline="hover">
                  <Typography gutterBottom fontSize={'1em'} color='#868686' sx={{textDecoration: 'underline'}} component="div">
                    {article.data.title}
                  </Typography>
                </Link>
                <Stack gap={2} direction={'column'} alignItems={'left'}>
                  <Typography variant="body2" color="text.secondary">
                  {article.text?.slice(0, 100)}...
                  </Typography>
                <Stack gap={1} direction={'row'} alignItems={'center'}>
                <Chip 
                  variant="outlined" 
                  label={
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                      {article.data.date}
                    </Typography>
                  } 
                  sx={{ borderColor: '#B0B0B0', color: '#868686' }}
                />
                  <Divider orientation="vertical" flexItem />
                  <Chip 
                  variant="outlined" 
                  label={
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                      {article.data.author || article.data.time || '06:30 PM'}
                    </Typography>
                  } 
                  sx={{ borderColor: '#B0B0B0', color: '#868686' }}
                />
                </Stack>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewsArticles;