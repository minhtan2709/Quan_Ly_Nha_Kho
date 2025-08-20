import { Router } from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController";
import { authRequired, requireRole } from "../middleware/auth";

const router = Router();

// Tất cả endpoints Users chỉ cho ADMIN
router.get("/", authRequired, requireRole("ADMIN"), getUsers);
router.post("/", authRequired, requireRole("ADMIN"), createUser);
router.put("/:id", authRequired, requireRole("ADMIN"), updateUser);
router.delete("/:id", authRequired, requireRole("ADMIN"), deleteUser);

export default router;
