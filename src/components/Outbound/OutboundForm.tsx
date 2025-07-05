import React, { useState } from 'react';

interface OutboundData {
  code: string;
  customer: string;
  status: string;
}

interface OutboundFormProps {
  onSubmit: (data: OutboundData) => void;
  initialData?: OutboundData;
}

export default function OutboundForm({ onSubmit, initialData }: OutboundFormProps) {
  const [formData, setFormData] = useState<OutboundData>(initialData || { code: '', customer: '', status: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields... */}
    </form>
  );
}
