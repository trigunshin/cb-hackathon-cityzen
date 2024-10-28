"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, Link, Stack, Chip, Skeleton } from '@mui/material';
import { Grid, useTheme } from '@mui/system';
import { AddToCalendarButton } from 'add-to-calendar-button-react';

interface EventsResultsProps {
  loading?: boolean;
}

const fetchEvents = async () => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return exampleEvents;
};

const EventsResults: React.FC<EventsResultsProps> = ({ loading: parentLoading }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    fetchEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const SkeletonEvent = () => (
    <Grid size={{xs: 12, md: 4, sm: 4}}>
      <Card variant="outlined" sx={{ height: '100%', width: '100%', overflow: 'visible', border: `1px solid ${theme.palette.secondary.contrastText}`}}>
        <CardContent>
          <Stack gap={2}>
            {/* title skeleton */}
            <Skeleton variant="text" width="80%" height={28} />
            
            {/* description skeleton */}
            <Stack gap={1}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
            </Stack>
            
            {/* date and time chips skeleton */}
            <Stack gap={1} flexDirection={'row'} flexWrap={'wrap'}>
              <Skeleton variant="rectangular" width={120} height={32} />
              <Box px={1}>
                <Divider orientation="vertical" flexItem />
              </Box>
              <Skeleton variant="rectangular" width={100} height={32} />
            </Stack>
            
            {/* calendar button skeleton */}
            <Box alignItems={'center'} width={"100%"}>
              <Skeleton variant="rectangular" width={200} height={40} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

  const isLoading = loading || parentLoading;

  return (
    <Box padding={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary} gutterBottom>
        Events we found for you based on your query:
      </Typography>
      <Grid container spacing={2}>
        {isLoading ? (
          //show skeleton events while loading
          Array(3).fill(0).map((_, index) => (
            <SkeletonEvent key={`skeleton-${index}`} />
          ))
        ) : (
          //show actual events when loaded
          events.map((event) => (
            <Grid size={{xs: 12, md: 4, sm: 4}} key={event.id}>
              <Card variant="outlined" sx={{ height: '100%', width: '100%', overflow: 'visible', border: `1px solid ${theme.palette.secondary.contrastText}`}}>
                <CardContent>
                  <Link href="#" underline="hover">
                    <Typography variant="subtitle1" color={theme.palette.text.primary} sx={{textDecoration: 'underline'}}>
                      {event.title}
                    </Typography>
                  </Link>
                  <Stack gap={2} direction="column" alignItems="left">
                    <Typography variant="body1" color={theme.palette.text.secondary}>
                      {event.description?.slice(0, 100)}...
                    </Typography>
                    <Stack gap={1} flexDirection={'row'} flexWrap={'wrap'}>
                      <Chip
                        variant="outlined"
                        label={
                          <Typography variant="body2" color={theme.palette.text.secondary}>
                            {event.start.toDateString()}
                          </Typography>
                        }
                        sx={{ borderColor: theme.palette.text.secondary}}
                      />
                      <Divider orientation="vertical" flexItem sx={{ bgcolor: "secondary.contrastText" }} />
                      <Chip
                        variant="outlined"
                        label={
                          <Typography variant="body2" color={theme.palette.text.secondary}>
                            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        }
                        sx={{ borderColor: theme.palette.text.secondary}}
                      />
                    </Stack>
                    <Box alignItems={'center'} width={"100%"}>
                      <AddToCalendarButton
                        hideBranding={true}
                        size='4|4|4'
                        name={event.title}
                        startDate={event.start.toISOString().split('T')[0]}
                        options={['Apple', 'Google', 'Yahoo', 'iCal']}
                        timeZone="America/Los_Angeles"
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

//example events with added start times
const exampleEvents = [
  {
    id: 1,
    title: 'Conference',
    start: new Date(2024, 9, 15, 9, 0), // October 15, 2024, 9:00 AM
    end: new Date(2024, 9, 17, 17, 0),
    description: 'Annual tech conference',
    image: '/api/placeholder/400/200',
  },
  {
    id: 2,
    title: 'Team Building',
    start: new Date(2024, 9, 20, 13, 30), // October 20, 2024, 1:30 PM
    end: new Date(2024, 9, 20, 17, 0),
    description: 'Company-wide team building event',
    image: '/api/placeholder/400/200',
  },
  {
    id: 3,
    title: 'Product Launch',
    start: new Date(2024, 9, 25, 10, 0), // October 25, 2024, 10:00 AM
    end: new Date(2024, 9, 25, 12, 0),
    description: 'Launching our new product line',
    image: '/api/placeholder/400/200',
  },
];

export default EventsResults;