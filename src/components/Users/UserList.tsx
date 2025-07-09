import { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Typography, Box, IconButton, Paper, Dialog, DialogTitle, DialogActions
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import axios from "../../utils/axiosInstance";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);

  // Load danh sách user
  const fetchUsers = () => {
    axios.get('/users')
      .then(res => {
        const arr = Array.isArray(res.data.data) ? res.data.data : [];
        setUsers(arr);
      })
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSuccess = () => {
    setOpenAdd(false);
    fetchUsers();
  };

  const handleEditSuccess = () => {
    setEditUser(null);
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    await axios.delete(`/users/${deleteUser.id}`);
    setDeleteUser(null);
    fetchUsers();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1250,height:550, margin: "40px auto", boxShadow: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Danh sách người dùng</Typography>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          + ADD USER
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell align="center">
                <IconButton color="info" onClick={() => setEditUser(user)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => setDeleteUser(user)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Dialog thêm user */}
      <AddUserDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAddSuccess={handleAddSuccess}
      />
      {/* Dialog sửa user */}
      <EditUserDialog
        open={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onEditSuccess={handleEditSuccess}
      />
      {/* Dialog xác nhận xóa user */}
      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <DialogTitle>Bạn chắc chắn muốn xóa người dùng này?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)}>Hủy</Button>
          <Button color="error" onClick={handleDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
