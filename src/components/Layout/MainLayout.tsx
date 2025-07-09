import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppBar from './AppBar';
import SideBar from './SideBar';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();  // Khởi tạo useNavigate

  const handleMenuClick = () => setSidebarOpen(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    navigate("/login");  // Điều hướng về trang login ngay lập tức
  };

  return (
    <Box display="flex" minHeight="100vh">
      <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box flexGrow={1}>
        <AppBar onMenuClick={handleMenuClick} onLogout={handleLogout} />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
