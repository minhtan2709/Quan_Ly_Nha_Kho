import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      // Lưu token vào localStorage
      localStorage.setItem('token', res.data.token || res.data.access_token);
      setSnackbar({
        open: true,
        message: 'Đăng nhập thành công!',
        type: 'success',
      });
      setTimeout(() => {
        setSnackbar({ ...snackbar, open: false });
        navigate('/products');
      }, 1200);
    } catch {
      setSnackbar({
        open: true,
        message: 'Đăng nhập thất bại!',
        type: 'error',
      });
    }
  };

  return (
    <Box component={Paper} sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
      <Typography variant="h5" mb={2}>Đăng nhập hệ thống</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, background: '#49A2B8' }}>
          Đăng nhập
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.type}
          icon={snackbar.type === 'success' ? <CheckCircleIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
