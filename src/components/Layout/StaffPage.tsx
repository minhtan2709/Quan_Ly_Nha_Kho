import { Paper, Typography, Box } from "@mui/material";
export default function StaffPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <Paper sx={{ p: 4, maxWidth: 550, m: "40px auto" }}>
      <Typography variant="h5" mb={2}>Thông tin tài khoản (Staff)</Typography>
      <Box>Email: {user.email}</Box>
      <Box>Username: {user.username}</Box>
      <Box>Role: {user.role}</Box>
      <Box>Status: {user.status}</Box>
    </Paper>
  );
}
