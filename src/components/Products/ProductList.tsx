import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/products').then(res => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      <Typography variant="h6" mb={2}>Product List</Typography>
      <Button variant="contained" sx={{ mb: 2 }}>+ Add Product</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.location?.name || ''}</TableCell>
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