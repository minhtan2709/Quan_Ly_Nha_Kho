import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Paper } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function OutboundDetail() {
  const { id } = useParams<{ id: string }>();
  const [outbound, setOutbound] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutbound = async () => {
      try {
        const response = await axios.get(`/outbounds/${id}`);
        setOutbound(response.data);
      } catch (error) {
        console.error('Error fetching outbound details:', error);
      }
    };

    fetchOutbound();
  }, [id]);

  const handleEdit = () => {
    navigate(`/outbounds/edit/${id}`);
  };

  if (!outbound) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">Outbound Detail</Typography>
      <Typography variant="h6">Code: {outbound.code}</Typography>
      <Typography variant="h6">Customer: {outbound.customer}</Typography>
      <Typography variant="h6">Status: {outbound.status}</Typography>
      <Typography variant="h6">Created At: {new Date(outbound.createdAt).toLocaleString()}</Typography>
      <Button variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
        Edit
      </Button>
    </Paper>
  );
}