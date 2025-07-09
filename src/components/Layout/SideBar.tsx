import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const items = [
  { text: 'Inbound', icon: <UploadIcon />, link: '/inbounds' },
  { text: 'Outbound', icon: <DownloadIcon />, link: '/outbounds' },
  { text: 'Stocktaking', icon: <AssessmentIcon />, link: '/stocktakings' },
  { text: 'Reports', icon: <AssessmentIcon />, link: '/reports' },
  { text: 'Users', icon: <GroupIcon />, link: '/users' },
];

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

export default function SideBar({ open, onClose }: SideBarProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <List sx={{ width: 220 }}>
        {items.map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link} onClick={onClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: "100%", px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary={<Typography fontWeight={500}>Log out</Typography>} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
}
