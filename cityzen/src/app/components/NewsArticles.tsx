import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, CardMedia, CircularProgress, Box, Stack, Divider, Link, Chip } from '@mui/material';
import { Grid } from '@mui/system';
import { ArticleMetadata } from '../utils/types';


const NewsArticles: React.FC<ArticleMetadata> = ({resposneData}) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography fontSize={'18px'} paddingY={2} color='#868686' gutterBottom>
        Here are some articles related to your search...
      </Typography>
      <Grid container spacing={2}>
        {resposneData.map((article, index) => (
          <Grid size={{xs: 12, md: 6, sm: 6}} key={index}>
            <Card variant='outlined' sx={{ height: '100%', width: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={article.image || '/api/placeholder/400/200'}
                alt={article.title}
              />
              <Divider />
              <CardContent>
                <Link href={article.url} underline="hover">
                  <Typography gutterBottom fontSize={'18px'} color='#868686' sx={{textDecoration: 'underline'}} component="div">
                    {article.title}
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
                      {article.date}
                    </Typography>
                  } 
                  sx={{ borderColor: '#B0B0B0', color: '#868686' }}
                />
                  <Divider orientation="vertical" flexItem />
                  <Chip 
                  variant="outlined" 
                  label={
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                      {article.author}
                    </Typography>
                  } 
                  sx={{ borderColor: '#B0B0B0', color: '#868686' }}
                />
                </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewsArticles;