import React from 'react';
import { Typography, Paper } from '@mui/material';

interface AuthDetail {
  id: number;
  email: string;
  status: string;
  // thêm các trường khác nếu backend trả về
}

const AuthDetail = () => {
  const [authDetail, setAuthDetail] = React.useState<AuthDetail | null>(null);

  React.useEffect(() => {
    const fetchAuthDetail = async () => {
      // TODO: Gọi API và cập nhật setAuthDetail
      // Ví dụ: const res = await axiosInstance.get('/auth/me');
      // setAuthDetail(res.data);
    };
    fetchAuthDetail();
  }, []);

  if (!authDetail) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5">Authentication Detail</Typography>
      <Typography variant="body1">ID: {authDetail.id}</Typography>
      <Typography variant="body1">Email: {authDetail.email}</Typography>
      <Typography variant="body1">Status: {authDetail.status}</Typography>
      {/* Add more fields as necessary */}
    </Paper>
  );
};

export default AuthDetail;
