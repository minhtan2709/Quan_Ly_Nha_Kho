import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppBar from './AppBar';
import SideBar from './SideBar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);

  return (
    <Box display="flex">
      <AppBar onMenuClick={handleMenuClick} />
      <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
