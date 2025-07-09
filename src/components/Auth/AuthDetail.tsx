import React from 'react';
import { Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';

interface AuthDetailData {
  id: number;
  email: string;
  status: string;
  role?: string;
  username?: string;
}

const AuthDetail = () => {
  const [authDetail, setAuthDetail] = React.useState<AuthDetailData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchAuthDetail = async () => {
      try {
        // Lấy token từ localStorage nếu có
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAuthDetail(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không lấy được thông tin user");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthDetail();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!authDetail) return <Typography>Không có thông tin user.</Typography>;

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" mb={1}>Thông tin người dùng</Typography>
      <Typography variant="body1"><b>ID:</b> {authDetail.id}</Typography>
      <Typography variant="body1"><b>Email:</b> {authDetail.email}</Typography>
      <Typography variant="body1"><b>Status:</b> {authDetail.status}</Typography>
      {authDetail.role && <Typography variant="body1"><b>Role:</b> {authDetail.role}</Typography>}
      {authDetail.username && <Typography variant="body1"><b>Username:</b> {authDetail.username}</Typography>}
    </Paper>
  );
};

export default AuthDetail;
