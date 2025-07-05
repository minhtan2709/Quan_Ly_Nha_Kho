import React from 'react';
import { Typography, Paper, Button } from '@mui/material';

interface Product {
  name: string;
  code: string;
  quantity: number;
  location?: { name: string };
  // các trường khác...
}

interface ProductDetailProps {
  product: Product | null;
  onEdit: () => void;
}

const ProductDetail = ({ product, onEdit }: ProductDetailProps) => {
  if (!product) return <Typography>Loading...</Typography>;
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">{product.name}</Typography>
      <Typography variant="body1">Code: {product.code}</Typography>
      <Typography variant="body1">Quantity: {product.quantity}</Typography>
      <Typography variant="body1">Location: {product.location?.name || 'N/A'}</Typography>
      <Button variant="contained" onClick={onEdit} sx={{ mt: 2 }}>
        Edit Product
      </Button>
    </Paper>
  );
};
export default ProductDetail;
