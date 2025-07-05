import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token || res.data.access_token);
      onLogin();
    } catch {
      setError('Login failed');
    }
  };

  return (
    <Box component={Paper} sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
      <Typography variant="h5" mb={2}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" fullWidth required margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth required margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
      </form>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')} message={error} />
    </Box>
  );
}
