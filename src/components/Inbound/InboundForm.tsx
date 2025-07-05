import { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar } from '@mui/material';
import axios from '../../utils/axiosInstance';

interface InboundFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const InboundForm: React.FC<InboundFormProps> = ({ onSubmit, initialData }) => {
  const [code, setCode] = useState(initialData?.code || '');
  const [supplier, setSupplier] = useState(initialData?.supplier || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || 0);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { code, supplier, quantity };
      await axios.post('/inbounds', data);
      onSubmit(data);
    } catch (err) {
      setError('Failed to create inbound record');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2}>Inbound Form</Typography>
      <TextField
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
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
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit</Button>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')} message={error} />
    </Box>
  );
};

export default InboundForm;