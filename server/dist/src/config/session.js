"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGN_OPTS = exports.JWT_EXPIRES_SECONDS = exports.JWT_SECRET = exports.COOKIE_NAME = void 0;
// server/src/config/session.ts
const crypto_1 = __importDefault(require("crypto"));
/**
 * Tên cookie lưu JWT
 */
exports.COOKIE_NAME = process.env.COOKIE_NAME || "token";
/**
 * SECRET để ký JWT.
 * - Dev: nếu KHÔNG đặt JWT_SECRET, mỗi lần server khởi động sẽ sinh secret ngẫu nhiên
 *   => toàn bộ token cũ vô hiệu (đúng yêu cầu “restart phải đăng nhập lại”).
 * - Prod: nên đặt JWT_SECRET cố định trong .env để người dùng không bị đăng xuất khi deploy.
 */
exports.JWT_SECRET = process.env.JWT_SECRET || crypto_1.default.randomBytes(32).toString("hex");
/**
 * Thời hạn token (tính bằng GIÂY) để tránh lỗi type với @types/jsonwebtoken.
 * Mặc định 2 giờ.
 * Có thể cấu hình qua biến môi trường: JWT_EXPIRES_SECONDS (ví dụ 10800 = 3 giờ)
 */
exports.JWT_EXPIRES_SECONDS = Number(process.env.JWT_EXPIRES_SECONDS || "") || 2 * 60 * 60;
/**
 * Tiện ích: SignOptions dựng sẵn để truyền cho jwt.sign(...)
 */
exports.SIGN_OPTS = { expiresIn: exports.JWT_EXPIRES_SECONDS };
