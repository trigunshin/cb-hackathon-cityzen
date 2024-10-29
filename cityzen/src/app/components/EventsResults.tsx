"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, Link, Stack, Chip, Skeleton, CardMedia, Button } from '@mui/material';
import { Grid, useTheme } from '@mui/system';
import { AddToCalendarButton } from 'add-to-calendar-button-react';

interface EventsResultsProps {
  loading?: boolean;
}

const fetchEvents = async () => {
  //simulating API call with a delay
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
      <Grid size={12}>
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            width: '100%',
            overflow: 'visible',
            border: `1px solid ${theme.palette.secondary.contrastText}`,
            borderRadius: theme.spacing(2),
            display: 'flex', flexGrow: 1,
          }}
        >
          <CardContent sx={{display: 'flex', flexGrow: 1,}}>
            <Stack gap={1} sx={{width: '100%', height: '100%'}}>
              {/* Title skeleton */}
              <Skeleton variant="text" width="80%" height={28} />
    
              {/* Description skeleton */}
              <Stack gap={1}>
                <Skeleton variant="text" width="100%" height={80} />
              </Stack>
    
              {/* Date and time chips skeleton */}
              <Stack gap={1} flexDirection="row" flexWrap="wrap">
                <Skeleton variant="rectangular" width={120} height={32} />
                <Box px={1}>
                  <Divider orientation="vertical" flexItem />
                </Box>
                <Skeleton variant="rectangular" width={100} height={32} />
              </Stack>
    
              {/* Calendar button skeleton */}
              <Box alignItems="center" width="100%">
                <Skeleton variant="rectangular" width={150} height={28} />
              </Box>
            </Stack>
          </CardContent>
    
          {/* CardMedia skeleton */}
          <CardMedia
            sx={{
              height: 'auto',
              display: 'flex', flexGrow: 1,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height='100%' />
          </CardMedia>
        </Card>
      </Grid>
    );

  const isLoading = loading || parentLoading;

  return (
    <Stack gap={1} paddingY={{lg: 4, xl: 4, md: 3, sm: 2, xs: 2}}>
      <Typography variant="subtitle1" padding={2} color={theme.palette.text.secondary}>
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
            <Grid size={12} key={event.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexGrow: 1, width: '100%', overflow: 'visible', border: `1px solid ${theme.palette.secondary.contrastText}`, borderRadius: theme.spacing(2)}}>
                <CardContent sx={{ display: 'flex', flexGrow: 2}}>
                  <Stack sx={{width: '100%', gap: 1}}>
                  <Link href="#" underline="hover">
                    <Typography variant="body1" color={theme.palette.text.secondary} sx={{textDecoration: 'underline'}}>
                      {event.title}
                    </Typography>
                  </Link>
                  <Stack gap={2} direction="column" alignItems="left">
                    <Typography variant="body1" color={theme.palette.text.secondary}>
                      {event.description?.slice(0, 500)}...
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
                    <Grid container alignItems={'center'} width='100%' columns={3}>
                      <Grid flex={1}>
                        <AddToCalendarButton
                          hideBranding={true}
                          size='4|4|4'
                          name={event.title}
                          startDate={event.start.toISOString().split('T')[0]}
                          options={['Apple', 'Google', 'Yahoo', 'iCal']}
                          timeZone="America/Los_Angeles"
                        />
                      </Grid>
                      <Grid flex={1}>
                        <Button variant='outlined'>Source</Button>
                      </Grid>
                    </Grid>
                  </Stack>
                  </Stack>
                </CardContent>
                <CardMedia
                  sx={{
                    height: 'auto',
                    objectFit: 'cover',
                    backgroundColor: 'black',
                    display: 'flex', flexGrow: 1,
                  }}
                >
                  {event.image}
                </CardMedia>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Stack>
  );
};

//example events with added start times
const exampleEvents = [
  {
    id: 1,
    title: 'Conference',
    start: new Date(2024, 9, 15, 9, 0), // October 15, 2024, 9:00 AM
    end: new Date(2024, 9, 17, 17, 0),
    description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Dolor ornare magna ligula tempus nisl potenti dolor cubilia. Dignissim nulla eget class nascetur blandit tellus volutpat tortor metus. Sagittis quisque parturient inceptos; placerat ac commodo iaculis egestas.',
    image: '/api/placeholder/400/200',
  },
  {
    id: 2,
    title: 'Team Building',
    start: new Date(2024, 9, 20, 13, 30), // October 20, 2024, 1:30 PM
    end: new Date(2024, 9, 20, 17, 0),
    description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Dolor ornare magna ligula tempus nisl potenti dolor cubilia. Dignissim nulla eget class nascetur blandit tellus volutpat tortor metus. Sagittis quisque parturient inceptos; placerat ac commodo iaculis egestas.',
    image: '/api/placeholder/400/200',
  },
  {
    id: 3,
    title: 'Product Launch',
    start: new Date(2024, 9, 25, 10, 0), // October 25, 2024, 10:00 AM
    end: new Date(2024, 9, 25, 12, 0),
    description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Dolor ornare magna ligula tempus nisl potenti dolor cubilia. Dignissim nulla eget class nascetur blandit tellus volutpat tortor metus. Sagittis quisque parturient inceptos; placerat ac commodo iaculis egestas.',
    image: '/api/placeholder/400/200',
  },
];

export default EventsResults;