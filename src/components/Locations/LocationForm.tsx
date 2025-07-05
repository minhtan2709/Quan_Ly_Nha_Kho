import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from '../../utils/axiosInstance';

interface LocationFormProps {
  locationId?: string;
  onSubmit: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ locationId, onSubmit }) => {
  const [location, setLocation] = useState({ code: '', name: '', type: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationId) {
      setIsLoading(true);
      axios.get(`/locations/${locationId}`)
        .then(response => setLocation(response.data))
        .finally(() => setIsLoading(false));
    }
  }, [locationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const request = locationId 
      ? axios.put(`/locations/${locationId}`, location) 
      : axios.post('/locations', location);

    request.then(() => {
      onSubmit();
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Box component={Paper} sx={{ padding: 3 }}>
      <Typography variant="h6">{locationId ? 'Edit Location' : 'Add Location'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Code"
          name="code"
          value={location.code}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Name"
          name="name"
          value={location.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Type"
          name="type"
          value={location.type}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={location.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Box>
  );
};

export default LocationForm;