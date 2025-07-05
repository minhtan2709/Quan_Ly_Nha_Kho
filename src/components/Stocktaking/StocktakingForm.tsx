import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from '../../utils/axiosInstance';

interface StocktakingFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function StocktakingForm({ onSubmit, initialData }: StocktakingFormProps) {
  const [formData, setFormData] = useState(initialData || { code: '', date: '', notes: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/stocktakings', formData);
      onSubmit(formData);
    } catch (error) {
      console.error('Error creating stocktaking record:', error);
    }
  };

  return (
    <Box component={Paper} sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Stocktaking' : 'Create Stocktaking'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
}