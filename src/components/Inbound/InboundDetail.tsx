import { useEffect, useState } from 'react';
import { Typography, Button, Paper } from '@mui/material';
import axios from '../../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const InboundDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [inbound, setInbound] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInboundDetail = async () => {
      try {
        const response = await axios.get(`/inbounds/${id}`);
        setInbound(response.data);
      } catch (error) {
        console.error('Error fetching inbound detail:', error);
      }
    };

    fetchInboundDetail();
  }, [id]);

  const handleEdit = () => {
    navigate(`/inbounds/edit/${id}`);
  };

  if (!inbound) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">Inbound Detail</Typography>
      <Typography variant="h6">ID: {inbound.id}</Typography>
      <Typography variant="body1">Supplier: {inbound.supplier}</Typography>
      <Typography variant="body1">Status: {inbound.status}</Typography>
      <Typography variant="body1">Created At: {new Date(inbound.createdAt).toLocaleString()}</Typography>
      <Button variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
        Edit
      </Button>
    </Paper>
  );
};

export default InboundDetail;