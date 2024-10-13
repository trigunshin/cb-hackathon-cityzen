import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Box } from '@mui/material';
import { Grid } from '@mui/system';
import Link from 'next/link';

interface PollPlace {
  name: string;
  link: string;
}

const CityHallResults = () => {
  const [pollPlaces, setPollPlaces] = useState<PollPlace[]>([]);

  useEffect(() => {

    const fetchPollPlaces = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          const mockPollPlaces = [
            { name: 'Poll Place A', link: 'https://example.com/poll-a' },
            { name: 'Poll Place B', link: 'https://example.com/poll-b' },
            { name: 'Poll Place C', link: 'https://example.com/poll-c' }
          ];
          setPollPlaces(mockPollPlaces);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch poll places:', error);
      }
    };

    fetchPollPlaces();
  }, []);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid size={{xs: 12, sm: 6, md: 4}}>
          <Typography variant="h6" gutterBottom>
            City Hall
          </Typography>
          {pollPlaces.map((place, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {place.name}
                </Typography>
                <Link href={place.link} target="_blank" rel="noopener">
                  More Details
                </Link>
              </CardContent>
            </Card>
          ))}
      </Grid>
    </Grid>
  );
};

export default CityHallResults;