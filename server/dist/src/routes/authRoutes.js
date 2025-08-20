"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/login", authController_1.login);
router.get("/me", auth_1.authRequired, authController_1.me);
// Cho phép logout kể cả khi token đã hết hạn/không hợp lệ → vẫn xoá cookie được
router.post("/logout", authController_1.logout);
exports.default = router;
