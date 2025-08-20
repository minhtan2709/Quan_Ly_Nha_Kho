import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export type JwtUser = {
  userId: string;
  email: string;
  role: "ADMIN" | "STAFF";
};

declare global {
  namespace Express {
    interface Request { user?: JwtUser }
  }
}

const COOKIE = process.env.COOKIE_NAME || "token";
const SECRET: jwt.Secret = process.env.JWT_SECRET || "devsecret";

/** Lấy token từ Cookie hoặc Authorization: Bearer <token> */
function extractToken(req: Request): string | null {
  const fromCookie = req.cookies?.[COOKIE];
  if (fromCookie) return String(fromCookie);

  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  return null;
}

/** Bắt buộc đăng nhập: không có/không hợp lệ → 401 */
export function authRequired(req: Request, res: Response, next: NextFunction) {
  const raw = extractToken(req);
  if (!raw) return res.status(401).json({ message: "Unauthenticated" });

  try {
    const payload = jwt.verify(raw, SECRET) as JwtUser;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/** Chặn theo role: nếu role không nằm trong danh sách → 403 */
export function requireRole(...roles: Array<JwtUser["role"] | string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: "Unauthenticated" });
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Permission denied" });
    }
    return next();
  };
}

/** Helper (tuỳ chọn) */
export function isAdmin(req: Request): boolean {
  return req.user?.role === "ADMIN";
}
