import { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance"; // Dùng instance cấu hình sẵn


export default function Login({ onLogin }: { onLogin?: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // clear lỗi cũ
        try {
            const res = await axios.post("/auth/login", { email, password });
            console.log("API response:", res.data);
            const { access_token, user } = res.data.data; // <-- ĐÚNG
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            // Điều hướng:
            if (user.role === "ADMIN") {
                navigate("/admin");
            } else if (user.role === "STAFF") {
                navigate("/staff");
            } else if (user.role === "VIEWER") {
                navigate("/user");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ maxWidth: 350, mx: "auto", mt: 6 }}
        >
            <Typography variant="h5" mb={2}>Đăng nhập</Typography>
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={!email && showError}
                helperText={!email && showError ? "Bạn phải nhập email." : ""}
            />
            <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={!password && showError}
                helperText={!password && showError ? "Bạn phải nhập mật khẩu." : ""}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Đăng nhập
            </Button>
        </Box>
    );
}
