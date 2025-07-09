import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';

interface AppBarProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ onMenuClick, onLogout }) => {
  return (
    <MuiAppBar position="fixed" sx={{ bgcolor: "#49A2B8" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Warehouse Management
        </Typography>
        <IconButton color="inherit" onClick={onLogout}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
