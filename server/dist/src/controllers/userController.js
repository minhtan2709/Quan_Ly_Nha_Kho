"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
const sanitize = (u) => ({
    userId: u.userId,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const q = ((_a = req.query.q) !== null && _a !== void 0 ? _a : "").toString().trim() || undefined;
        const page = Math.max(parseInt(String(req.query.page || "1"), 10), 1);
        const limit = Math.max(Math.min(parseInt(String(req.query.limit || "10"), 10), 100), 1);
        const skip = (page - 1) * limit;
        const where = q
            ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
            : undefined;
        const [items, total] = yield prisma.$transaction([
            prisma.users.findMany({
                where, skip, take: limit, orderBy: { name: "asc" },
                select: { userId: true, name: true, email: true, role: true, createdAt: true },
            }),
            prisma.users.count({ where }),
        ]);
        res.setHeader("X-Total-Count", String(total));
        res.json(items.map(sanitize));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error retrieving users" });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role)
            return res.status(400).json({ message: "name, email, password, role are required" });
        if (!["ADMIN", "STAFF"].includes(role))
            return res.status(400).json({ message: "Invalid role" });
        const dup = yield prisma.users.findFirst({ where: { email } });
        if (dup)
            return res.status(409).json({ message: "Email already exists" });
        const created = yield prisma.users.create({
            data: { userId: (0, crypto_1.randomUUID)(), name, email, password, role }, // NOTE: demo plain password
            select: { userId: true, name: true, email: true, role: true, createdAt: true },
        });
        res.status(201).json(sanitize(created));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Create user failed" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        if (!name && !email && !password && !role)
            return res.status(400).json({ message: "No fields to update" });
        if (role && !["ADMIN", "STAFF"].includes(role))
            return res.status(400).json({ message: "Invalid role" });
        if (role && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) === id && role !== req.user.role)
            return res.status(400).json({ message: "Cannot change your own role" });
        if (email) {
            const dup = yield prisma.users.findFirst({ where: { email, NOT: { userId: id } }, select: { userId: true } });
            if (dup)
                return res.status(409).json({ message: "Email already exists" });
        }
        const updated = yield prisma.users.update({
            where: { userId: id },
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, (name ? { name } : {})), (email ? { email } : {})), (password ? { password } : {})), (role ? { role } : {})),
            select: { userId: true, name: true, email: true, role: true, createdAt: true },
        });
        res.json(sanitize(updated));
    }
    catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === "P2025")
            return res.status(404).json({ message: "User not found" });
        console.error(e);
        res.status(500).json({ message: "Update user failed" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) === id)
            return res.status(400).json({ message: "Cannot delete your own account" });
        yield prisma.users.delete({ where: { userId: id } });
        res.status(204).end();
    }
    catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === "P2025")
            return res.status(404).json({ message: "User not found" });
        console.error(e);
        res.status(500).json({ message: "Delete user failed" });
    }
});
exports.deleteUser = deleteUser;
