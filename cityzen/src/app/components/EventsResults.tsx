import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, CardMedia, CircularProgress, Box } from '@mui/material';
import { Grid } from '@mui/system';

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Date: {event.start.toDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Example events
const exampleEvents = [
  {
    id: 1,
    title: 'Conference',
    start: new Date(2024, 9, 15),
    end: new Date(2024, 9, 17),
    description: 'Annual tech conference',
    image: '/api/placeholder/400/200',
  },
  {
    id: 2,
    title: 'Team Building',
    start: new Date(2024, 9, 20),
    end: new Date(2024, 9, 20),
    description: 'Company-wide team building event',
    image: '/api/placeholder/400/200',
  },
  {
    id: 3,
    title: 'Product Launch',
    start: new Date(2024, 9, 25),
    end: new Date(2024, 9, 25),
    description: 'Launching our new product line',
    image: '/api/placeholder/400/200',
  },
];

export default EventsResults;