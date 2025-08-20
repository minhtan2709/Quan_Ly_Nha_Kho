"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Tất cả endpoints Users chỉ cho ADMIN
router.get("/", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), userController_1.getUsers);
router.post("/", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), userController_1.createUser);
router.put("/:id", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), userController_1.updateUser);
router.delete("/:id", auth_1.authRequired, (0, auth_1.requireRole)("ADMIN"), userController_1.deleteUser);
exports.default = router;
