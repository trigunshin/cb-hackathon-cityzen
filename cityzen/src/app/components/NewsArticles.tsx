import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, CardMedia, CircularProgress, Box, Stack, Divider, Link, Chip } from '@mui/material';
import { Grid } from '@mui/system';
import { getArticleData } from '../utils/getArticles';
import { JsonData, ExtractedArticleData } from '../utils/types';

const jsonData: JsonData = {
  "response": "The documents contain information about recent news articles.",
  "source_nodes": [
    {
      "node": {
        "id_": "article1",
        "text": "Baby Reindeer's explosive £92million Netflix court case has taken a dramatic twist as court documents were laid bare. Last month, the woman who claims she is the real-life Martha from the award-winning show was given the green light by a judge in Los Angeles to sue the streaming giant.",
        "extra_info": {
          "author": "Jane Doe",
          "word_count": 150,
          "category": "Entertainment"
        }
      },
      "score": 0.228941157
    },
    {
      "node": {
        "id_": "article2",
        "text": "Diddy accuses federal officials of leaking material in his sex-trafficking case. The timely production of these materials is critical to Mr. Combs' ability to prepare his defense, his lawyers wrote.",
        "extra_info": {
          "author": "John Smith",
          "word_count": 100,
          "category": "Legal"
        }
      },
      "score": 0.251545906
    },
    {
      "node": {
        "id_": "article3",
        "text": "SpaceX successfully launched another batch of Starlink satellites into orbit today, further expanding its global internet coverage. The Falcon 9 rocket lifted off from Cape Canaveral at dawn, carrying 60 satellites.",
        "extra_info": {
          "author": "Emily Johnson",
          "word_count": 120,
          "category": "Technology"
        }
      },
      "score": 0.198765432
    }
  ],
  "metadata": {
    "article1": {
      "title": "Baby Reindeer £92million Netflix court case takes twist as documents laid bare",
      "source": "Entertainment Weekly",
      "date": "2024-10-12",
      "sentiment": 0.1294117647058823,
      "image": "https://example.com/images/baby-reindeer.jpg",
      "url": "https://example.com/baby-reindeer-case"
    },
    "article2": {
      "title": "Diddy accuses federal officials of leaking material in his sex-trafficking case",
      "source": "Legal Times",
      "date": "2024-10-10",
      "sentiment": -0.2627450980392156,
      "image": "https://example.com/images/diddy-case.jpg",
      "url": "https://example.com/diddy-case"
    },
    "article3": {
      "title": "SpaceX launches more Starlink satellites, expanding global internet coverage",
      "source": "Space News",
      "date": "2024-10-15",
      "sentiment": 0.7890123456789012,
      "image": "https://example.com/images/spacex-launch.jpg",
      "url": "https://example.com/spacex-starlink-launch"
    }
  }
};


// Mock API call to get the JSON data
const fetchArticleData = async (): Promise<JsonData> => {
  // In a real application, this would be an API call
  // For now, we'll return the sample data after a short delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return jsonData;
};

const NewsArticles: React.FC = () => {
  const [articles, setArticles] = useState<ExtractedArticleData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true);
      fetchArticleData().then((data: JsonData) => {
          const extractedArticles = getArticleData(data, 9);
          setArticles(extractedArticles);
          setLoading(false);
      });
  }, []);

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
        {articles.map((article, index) => (
          <Grid size={{xs: 12, md: 6, sm: 6}} key={index}>
            <Card variant='outlined' sx={{ height: '100%', width: '100%' }}>
              {/* <CardMedia
                component="img"
                height="140"
                image={article.image || '/api/placeholder/400/200'}
                alt={article.title}
              /> */}
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