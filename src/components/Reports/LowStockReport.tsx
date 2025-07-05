import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function LowStockReport() {
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/reports/low-stock')
      .then(res => setLowStock(res.data))
      .catch(() => setLowStock([]));
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Low Stock Report</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Code</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lowStock.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}