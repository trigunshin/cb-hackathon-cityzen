import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { Grid } from '@mui/system';

interface DataItem {
  id: number;
  title: string;
  description: string;
}

const CityHallResults = () => {
  // State to hold the data from the API and loading state
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetch delay
      setTimeout(() => {
        // Mocked data as if it was fetched from an API
        const mockData = [
          {
            id: 1,
            title: 'City Hall Event A',
            description: 'Description of City Hall Event A'
          },
          {
            id: 2,
            title: 'City Hall Event B',
            description: 'Description of City Hall Event B'
          },
          {
            id: 3,
            title: 'City Hall Event C',
            description: 'Description of City Hall Event C'
          }
        ];

        setData(mockData);
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        data.map((item, index) => (
          <Grid size={{xs: 12, sm: 6, md: 4 }} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default CityHallResults;
