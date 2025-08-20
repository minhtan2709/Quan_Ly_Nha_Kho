// server/src/config/session.ts
import crypto from "crypto";
import type { Secret, SignOptions } from "jsonwebtoken";

/**
 * Tên cookie lưu JWT
 */
export const COOKIE_NAME: string = process.env.COOKIE_NAME || "token";

/**
 * SECRET để ký JWT.
 * - Dev: nếu KHÔNG đặt JWT_SECRET, mỗi lần server khởi động sẽ sinh secret ngẫu nhiên
 *   => toàn bộ token cũ vô hiệu (đúng yêu cầu “restart phải đăng nhập lại”).
 * - Prod: nên đặt JWT_SECRET cố định trong .env để người dùng không bị đăng xuất khi deploy.
 */
export const JWT_SECRET: Secret =
  (process.env.JWT_SECRET as Secret) || crypto.randomBytes(32).toString("hex");

/**
 * Thời hạn token (tính bằng GIÂY) để tránh lỗi type với @types/jsonwebtoken.
 * Mặc định 2 giờ.
 * Có thể cấu hình qua biến môi trường: JWT_EXPIRES_SECONDS (ví dụ 10800 = 3 giờ)
 */
export const JWT_EXPIRES_SECONDS: number =
  Number(process.env.JWT_EXPIRES_SECONDS || "") || 2 * 60 * 60;

/**
 * Tiện ích: SignOptions dựng sẵn để truyền cho jwt.sign(...)
 */
export const SIGN_OPTS: SignOptions = { expiresIn: JWT_EXPIRES_SECONDS };
