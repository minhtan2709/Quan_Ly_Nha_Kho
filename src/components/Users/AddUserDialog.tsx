import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
  MenuItem, FormControl, InputLabel, Select
} from "@mui/material";
import axios from "../../utils/axiosInstance";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
  { value: "VIEWER", label: "Viewer" },
];

export default function AddUserDialog({ open, onClose, onAddSuccess }: AddUserDialogProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("STAFF");
  const [error, setError] = useState("");

  // RESET form khi mở dialog
  useEffect(() => {
    if (open) {
      setEmail("");
      setUsername("");
      setPassword("");
      setPhoneNumber("");
      setRole("STAFF");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!phoneNumber) {
      setError("Bạn phải nhập số điện thoại!");
      return;
    }
    try {
      await axios.post("/users", {
        username,
        password,
        email,
        role,
        status: "active",
        phone_number: phoneNumber,
        
      });
      setUsername(""); setPassword("");setEmail(""); setRole("STAFF"); setPhoneNumber(""); 
      setError("");
      onAddSuccess();
    } catch (e: any) {
      setError(e.response?.data?.message || "Thêm người dùng thất bại!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm người dùng</DialogTitle>
      <DialogContent>
        <form autoComplete="off">
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="off"
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
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            label="Phone number"
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
                <MenuItem value={r.value} key={r.value}>{r.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && (
            <div style={{ color: "red", marginTop: 8 }}>{error}</div>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>Thêm</Button>
      </DialogActions>
    </Dialog>
  );

}
