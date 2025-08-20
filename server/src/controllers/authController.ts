import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_SECRET: Secret = process.env.JWT_SECRET || "devsecret";
const JWT_EXPIRES_SECONDS = Number(process.env.JWT_EXPIRES_SECONDS || 60 * 60 * 8); // 8h

type UserRow = {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body || {}) as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const user = (await prisma.users.findFirst({ where: { email } })) as UserRow | null;

    // Demo: DB đang lưu plain password → so sánh trực tiếp
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.userId, email: user.email, role: user.role };
    const signOpts: SignOptions = { expiresIn: JWT_EXPIRES_SECONDS };
    const token = jwt.sign(payload, JWT_SECRET, signOpts);

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
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login error" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
    // Lấy tên từ DB bằng userId trong token
    const user = await prisma.users.findUnique({
      where: { userId: req.user.userId },
      select: { userId: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error getting profile" });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/", sameSite: "lax", secure: false });
  res.status(204).end();
};
