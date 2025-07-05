import { useEffect, useState } from 'react';
import { Typography, Button, Paper } from '@mui/material';
import axios from '../../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [id]);

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">Role: {user.role}</Typography>
      <Button variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
        Edit User
      </Button>
    </Paper>
  );
}