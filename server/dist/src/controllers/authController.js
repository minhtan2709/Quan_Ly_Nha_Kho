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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES_SECONDS = Number(process.env.JWT_EXPIRES_SECONDS || 60 * 60 * 8); // 8h
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = (req.body || {});
        if (!email || !password) {
            return res.status(400).json({ message: "email & password required" });
        }
        const user = (yield prisma.users.findFirst({ where: { email } }));
        // Demo: DB đang lưu plain password → so sánh trực tiếp
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = { userId: user.userId, email: user.email, role: user.role };
        const signOpts = { expiresIn: JWT_EXPIRES_SECONDS };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, signOpts);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: false, // bật true nếu HTTPS/cross-site
            sameSite: "lax",
            path: "/",
            maxAge: JWT_EXPIRES_SECONDS * 1000,
        });
        // trả về profile cơ bản (có name) cho FE nếu cần lưu
        res.json({
            user: { userId: user.userId, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Login error" });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthenticated" });
        // Lấy tên từ DB bằng userId trong token
        const user = yield prisma.users.findUnique({
            where: { userId: req.user.userId },
            select: { userId: true, name: true, email: true, role: true },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.json({ user });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error getting profile" });
    }
});
exports.me = me;
const logout = (_req, res) => {
    res.clearCookie(COOKIE_NAME, { path: "/", sameSite: "lax", secure: false });
    res.status(204).end();
};
exports.logout = logout;
