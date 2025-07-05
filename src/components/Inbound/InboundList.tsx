import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function InboundList() {
  const [inbounds, setInbounds] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/inbounds').then(res => setInbounds(res.data)).catch(() => setInbounds([]));
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Danh sách phiếu nhập kho</Typography>
      <Button variant="contained" sx={{ mb: 2 }}>+ Tạo phiếu nhập</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã phiếu</TableCell>
            <TableCell>Nhà cung cấp</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inbounds.map(i => (
            <TableRow key={i.id}>
              <TableCell>{i.code}</TableCell>
              <TableCell>{i.supplier}</TableCell>
              <TableCell>{i.status}</TableCell>
              <TableCell>{new Date(i.createdAt).toLocaleString()}</TableCell>
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