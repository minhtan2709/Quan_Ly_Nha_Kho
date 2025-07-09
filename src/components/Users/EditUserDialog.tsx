import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
  MenuItem, FormControl, InputLabel, Select
} from "@mui/material";
import axios from "../../utils/axiosInstance";

interface EditUserDialogProps {
  open: boolean;
  user: any; // user object cần sửa
  onClose: () => void;
  onEditSuccess: () => void;
}

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "VIEWER", label: "Viewer" },
];

export default function EditUserDialog({
  open,
  user,
  onClose,
  onEditSuccess,
}: EditUserDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [status, setStatus] = useState("active");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && user) {
      setUsername(user.username || "");
      setPassword(""); // Password luôn để trống khi edit, không auto fill
      setEmail(user.email || "");
      setRole(user.role || "STAFF");
      setStatus(user.status || "active");
      setPhoneNumber(user.phone_number || "");
      setError("");
    }
  }, [open, user]);

  const handleSubmit = async () => {
    if (!username || !email || !role || !status) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password.length > 0 && (password.length < 6 || password.length > 20)) {
      setError("Password phải từ 6-20 ký tự!");
      return;
    }
    try {
      // Chỉ gửi trường password nếu user muốn đổi mật khẩu
      const updateData: any = {
        username,
        email,
        role,
        status,
        phone_number: phoneNumber,
      };
      if (password) updateData.password = password;

      await axios.patch(`/users/${user.id}`, updateData);
      onEditSuccess();
    } catch (e: any) {
      setError(e.response?.data?.message || "Cập nhật người dùng thất bại!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          margin="dense"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="off"
        />
        <TextField
          label="Password mới (nếu muốn đổi)"
          fullWidth
          margin="dense"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          placeholder="Để trống nếu không đổi"
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="off"
        />
        <TextField
          label="Số điện thoại"
          fullWidth
          margin="dense"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          autoComplete="off"
        />
        <FormControl margin="dense" fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={e => setRole(e.target.value)}
          >
            {roleOptions.map(r => (
              <MenuItem value={r.value} key={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="dense" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        {error && (
          <div style={{ color: "red", marginTop: 8 }}>{error}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>Cập nhật</Button>
      </DialogActions>
    </Dialog>
  );
}
