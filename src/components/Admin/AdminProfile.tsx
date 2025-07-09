import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [user, setUser] = useState<any>(null); // Lưu trữ thông tin người dùng
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser) {
      navigate('/login'); // Nếu không có thông tin người dùng, điều hướng về login
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  if (!user) {
    return <Typography variant="h6">Loading...</Typography>; // Đang tải thông tin người dùng
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" mb={2}>Admin Profile</Typography>
        <Typography variant="h6">Username: {user.username}</Typography>
        <Typography variant="h6">Email: {user.email}</Typography>
        <Typography variant="h6">Role: {user.role}</Typography>
        <Typography variant="h6">Phone: {user.phone_number}</Typography>
        {/* Thêm thông tin người dùng khác nếu cần */}
      </Paper>
    </Box>
  );
};

export default AdminProfile;
