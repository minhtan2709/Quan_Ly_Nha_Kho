import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from '../../utils/axiosInstance';

interface ProductFormProps {
  initialData?: {
    id?: number;
    code: string;
    name: string;
    quantity: number;
    locationId: number;
  };
  onSubmit: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const [code, setCode] = useState(initialData?.code || '');
  const [name, setName] = useState(initialData?.name || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || 0);
  const [locationId, setLocationId] = useState(initialData?.locationId || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { code, name, quantity, locationId };
    
    try {
      if (initialData) {
        await axios.put(`/products/${initialData.id}`, productData);
      } else {
        await axios.post('/products', productData);
      }
      onSubmit(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">{initialData ? 'Edit Product' : 'Add Product'}</Typography>
      <TextField
        label="Product Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Location ID"
        type="number"
        value={locationId}
        onChange={(e) => setLocationId(Number(e.target.value))}
        fullWidth
        required
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {initialData ? 'Update' : 'Create'}
      </Button>
    </Box>
  );
};

export default ProductForm;