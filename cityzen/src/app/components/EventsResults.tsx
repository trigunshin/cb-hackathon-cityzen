import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardMedia, CircularProgress, Box, Divider, Link, Stack, Chip } from '@mui/material';
import { Grid } from '@mui/system';
import { AddToCalendarButton } from 'add-to-calendar-button-react';


const fetchEvents = async () => {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return exampleEvents;
};

const EventsResults = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetchEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading){
    return(
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography fontSize={'18px'} paddingY={2} color='#868686' gutterBottom>
        Events we found for you based on your query:
      </Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid size={{xs: 12, md: 6, sm: 4}} key={event.id}>
            <Card variant="outlined" sx={{ height: '100%', width: '100%', overflow: 'visible'}}>
              {/* <CardMedia
                component="img"
                height="140"
                image={event.image || '/api/placeholder/400/200'}
                alt={event.title}
              /> */}
              <Divider />
              <CardContent>
                <Link href="#" underline="hover">
                  <Typography gutterBottom fontSize="18px" color="#868686" sx={{textDecoration: 'underline'}} component="div">
                    {event.title}
                  </Typography>
                </Link>
                <Stack gap={2} direction="column" alignItems="left">
                  <Typography variant="body2" color="text.secondary">
                    {event.description?.slice(0, 100)}...
                  </Typography>
                  <Stack gap={1} direction="row" alignItems="center">
                    <Chip
                      variant="outlined"
                      label={
                        <Typography variant="body2" sx={{ color: 'inherit' }}>
                          {event.start.toDateString()}
                        </Typography>
                      }
                      sx={{ borderColor: '#B0B0B0', color: '#868686' }}
                    />
                    <Divider orientation="vertical" flexItem />
                    <Chip
                      variant="outlined"
                      label={
                        <Typography variant="body2" sx={{ color: 'inherit' }}>
                          {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      }
                      sx={{ borderColor: '#B0B0B0', color: '#868686' }}
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
        ))}
      </Grid>
    </Box>
  );
};

// Example events with added start times
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