import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar } from '@mui/material';
import axios from '../../utils/axiosInstance';

interface UserFormProps {
  userId?: string;
  onSubmit: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userId, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      axios.get(`/users/${userId}`)
        .then(response => {
          setUsername(response.data.username);
          setEmail(response.data.email);
        })
        .catch(() => setError('Failed to fetch user data'));
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userId) {
        await axios.put(`/users/${userId}`, { username, email });
      } else {
        await axios.post('/users', { username, email });
      }
      onSubmit();
    } catch {
      setError('Failed to save user data');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" mb={2}>{userId ? 'Edit User' : 'Create User'}</Typography>
      <TextField
        label="Username"
        fullWidth
        required
        margin="normal"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        {userId ? 'Update User' : 'Create User'}
      </Button>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')} message={error} />
    </Box>
  );
};

export default UserForm;