import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function StocktakingList() {
  const [stocktakings, setStocktakings] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/stocktakings').then(res => setStocktakings(res.data)).catch(() => setStocktakings([]));
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Danh sách kiểm kê kho</Typography>
      <Button variant="contained" sx={{ mb: 2 }}>+ Tạo phiếu kiểm kê</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã phiếu</TableCell>
            <TableCell>Người kiểm kê</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocktakings.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.user?.username || ''}</TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small">Xem</Button>
                <Button variant="outlined" color="error" size="small" sx={{ ml: 1 }}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}