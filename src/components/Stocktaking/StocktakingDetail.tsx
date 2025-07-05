import { useEffect, useState } from 'react';
import { Typography, Button, Paper } from '@mui/material';
import axios from '../../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

export default function StocktakingDetail() {
  const { id } = useParams<{ id: string }>();
  const [stocktaking, setStocktaking] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocktaking = async () => {
      try {
        const response = await axios.get(`/stocktakings/${id}`);
        setStocktaking(response.data);
      } catch (error) {
        console.error('Error fetching stocktaking details:', error);
      }
    };

    fetchStocktaking();
  }, [id]);

  const handleEdit = () => {
    navigate(`/stocktakings/edit/${id}`);
  };

  if (!stocktaking) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">Stocktaking Detail</Typography>
      <Typography variant="h6">ID: {stocktaking.id}</Typography>
      <Typography variant="body1">User: {stocktaking.user?.username}</Typography>
      <Typography variant="body1">Status: {stocktaking.status}</Typography>
      <Typography variant="body1">Created At: {new Date(stocktaking.createdAt).toLocaleString()}</Typography>
      <Button variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
        Edit
      </Button>
    </Paper>
  );
}