import { useEffect, useState } from 'react';
import { Typography, Paper, Button } from '@mui/material';
import axios from '../../utils/axiosInstance';
import { useParams } from 'react-router-dom';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/reports/${id}`);
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!report) {
    return <Typography>No report found.</Typography>;
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4">{report.title}</Typography>
      <Typography variant="body1">{report.description}</Typography>
      <Typography variant="body2">Created at: {new Date(report.createdAt).toLocaleString()}</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.history.back()}>
        Back
      </Button>
    </Paper>
  );
};

export default ReportDetail;