import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function LocationList() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/locations').then(res => setLocations(res.data)).catch(() => setLocations([]));
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Danh sách vị trí kho</Typography>
      <Button variant="contained" sx={{ mb: 2 }}>+ Thêm vị trí</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map(l => (
            <TableRow key={l.id}>
              <TableCell>{l.code}</TableCell>
              <TableCell>{l.name}</TableCell>
              <TableCell>{l.type}</TableCell>
              <TableCell>{l.description}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small">Sửa</Button>
                <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}