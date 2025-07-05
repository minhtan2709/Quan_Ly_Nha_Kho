import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function StockReport() {
  const [stockData, setStockData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('/reports/stock');
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock report data:', error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Stock Report</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Code</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockData.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}