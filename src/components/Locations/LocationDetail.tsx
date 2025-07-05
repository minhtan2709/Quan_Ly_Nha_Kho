import { useEffect, useState } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';
import axios from '../../utils/axiosInstance';
import { useParams } from 'react-router-dom';

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`/locations/${id}`);
        setLocation(response.data);
      } catch (error) {
        console.error('Error fetching location details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!location) {
    return <Typography variant="h6">Location not found</Typography>;
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">{location.name}</Typography>
      <Typography variant="body1">Code: {location.code}</Typography>
      <Typography variant="body1">Type: {location.type}</Typography>
      <Typography variant="body1">Description: {location.description}</Typography>
    </Paper>
  );
}