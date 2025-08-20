import { Request, Response } from "express";
import { PrismaClient, $Enums } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
type Role = $Enums.user_role;

const sanitize = (u: any) => ({
  userId: u.userId,
  name: u.name,
  email: u.email,
  role: u.role as Role,
  createdAt: u.createdAt,
});

export const getUsers = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q ?? "").toString().trim() || undefined;
    const page = Math.max(parseInt(String(req.query.page || "1"), 10), 1);
    const limit = Math.max(Math.min(parseInt(String(req.query.limit || "10"), 10), 100), 1);
    const skip = (page - 1) * limit;

    const where = q
      ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }] }
      : undefined;

    const [items, total] = await prisma.$transaction([
      prisma.users.findMany({
        where, skip, take: limit, orderBy: { name: "asc" },
        select: { userId: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.users.count({ where }),
    ]);

    res.setHeader("X-Total-Count", String(total));
    res.json(items.map(sanitize));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as { name: string; email: string; password: string; role: Role };
    if (!name || !email || !password || !role) return res.status(400).json({ message: "name, email, password, role are required" });
    if (!["ADMIN", "STAFF"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const dup = await prisma.users.findFirst({ where: { email } });
    if (dup) return res.status(409).json({ message: "Email already exists" });

    const created = await prisma.users.create({
      data: { userId: randomUUID(), name, email, password, role }, // NOTE: demo plain password
      select: { userId: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json(sanitize(created));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Create user failed" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, email, password, role } = req.body as Partial<{ name: string; email: string; password: string; role: Role }>;

    if (!name && !email && !password && !role) return res.status(400).json({ message: "No fields to update" });
    if (role && !["ADMIN", "STAFF"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (role && req.user?.userId === id && role !== req.user.role) return res.status(400).json({ message: "Cannot change your own role" });

    if (email) {
      const dup = await prisma.users.findFirst({ where: { email, NOT: { userId: id } }, select: { userId: true } });
      if (dup) return res.status(409).json({ message: "Email already exists" });
    }

    const updated = await prisma.users.update({
      where: { userId: id },
      data: { ...(name ? { name } : {}), ...(email ? { email } : {}), ...(password ? { password } : {}), ...(role ? { role } : {}) },
      select: { userId: true, name: true, email: true, role: true, createdAt: true },
    });

    res.json(sanitize(updated));
  } catch (e: any) {
    if (e?.code === "P2025") return res.status(404).json({ message: "User not found" });
    console.error(e);
    res.status(500).json({ message: "Update user failed" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (req.user?.userId === id) return res.status(400).json({ message: "Cannot delete your own account" });

    await prisma.users.delete({ where: { userId: id } });
    res.status(204).end();
  } catch (e: any) {
    if (e?.code === "P2025") return res.status(404).json({ message: "User not found" });
    console.error(e);
    res.status(500).json({ message: "Delete user failed" });
  }
};
