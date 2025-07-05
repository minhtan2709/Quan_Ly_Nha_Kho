import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';

import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
// import các icon...

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
    </Drawer>
  );
}
