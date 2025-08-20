import { Router } from "express";
import { login, me, logout } from "../controllers/authController";
import { authRequired } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.get("/me", authRequired, me);

// Cho phép logout kể cả khi token đã hết hạn/không hợp lệ → vẫn xoá cookie được
router.post("/logout", logout);

export default router;
