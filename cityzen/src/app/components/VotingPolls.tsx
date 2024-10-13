import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Stack, Box, Typography, Card, CardContent } from '@mui/material';
import { Grid } from '@mui/system';
import Link from 'next/link';

const VotingPolls = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [pollPlaces, setPollPlaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setTimeout(() => {
          const mockData = {
            locations: [
              { id: '1', name: 'City Hall', address: '123 Main St, Anytown' },
              { id: '2', name: 'Community Center', address: '456 Oak St, Anytown' },
              { id: '3', name: 'Library', address: '789 Elm St, Anytown' }
            ]
          };
          setLocations(mockData.locations);
          if (mockData.locations.length > 0) {
            setSelectedLocation(mockData.locations[0]);
          }
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    const fetchPollPlaces = async () => {
      try {
        setTimeout(() => {
          const mockPollPlaces = [
            { name: 'Poll Place A', link: 'https://example.com/poll-a' },
            { name: 'Poll Place B', link: 'https://example.com/poll-b' },
            { name: 'Poll Place C', link: 'https://example.com/poll-c' }
          ];
          setPollPlaces(mockPollPlaces);
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Failed to fetch poll places:', error);
      }
    };

    fetchLocations();
    fetchPollPlaces();
  }, []);

  function handleLocationChange(event: SelectChangeEvent) {
    const locationId = event.target.value;
    const location = locations.find(loc => loc.id === locationId);
    setSelectedLocation(location);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, sm: 6, md: 4}}>
        <Stack direction="column" spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={selectedLocation?.id || ''}
              onChange={handleLocationChange}
              label="Location"
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(selectedLocation?.address || '')}`}
          style={{ width: '100%', height: '400px', border: 0 }}
          title="Voting Location Map"
        ></iframe>
        </Stack>
      </Grid>
      <Grid size={{xs: 12, sm: 6, md: 4}}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Voting Poll Places
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default VotingPolls;
