"use client"
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Skeleton, Box } from '@mui/material';
import { Grid } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface DataItem {
  id: number;
  title: string;
  description: string;
}

interface CityHallResultsProps {
  loading?: boolean;
}

const CityHallResults: React.FC<CityHallResultsProps> = ({ loading = false }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

  const SkeletonCard = () => (
    <Grid size={{xs: 12, sm: 6, md: 4}}>
      <Card variant="outlined" sx={{ height: '100%', border: `1px solid ${theme.palette.secondary.contrastText}` }}>
        <CardContent>
          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} /> {/* Title */}
          <Skeleton variant="text" width="100%" /> {/* Description line 1 */}
          <Skeleton variant="text" width="90%" /> {/* Description line 2 */}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box padding={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} gutterBottom>
        Here are the relevant City Hall events...
      </Typography>
      <Grid container spacing={2} alignItems={'center'}>
        {loading ? (
          //show skeleton cards while loading
          Array(3).fill(0).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))
        ) : (
          //show actual data when loaded
          data.map((item, index) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
              <Card variant="outlined" sx={{ height: '100%', border: `1px solid ${theme.palette.secondary.contrastText}` }}>
                <CardContent>
                  <Typography variant="h5" color={theme.palette.text.primary} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default CityHallResults;