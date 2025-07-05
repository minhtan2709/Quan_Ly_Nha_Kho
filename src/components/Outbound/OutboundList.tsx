import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function OutboundList() {
  const [outbounds, setOutbounds] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/outbounds').then(res => setOutbounds(res.data)).catch(() => setOutbounds([]));
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Outbound Records</Typography>
      <Button variant="contained" sx={{ mb: 2 }}>+ Create Outbound</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Document Code</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Creation Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {outbounds.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.code}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small">View</Button>
                <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}