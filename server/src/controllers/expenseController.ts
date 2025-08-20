import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/expenses?category=Office&startDate=2025-08-01&endDate=2025-08-31
 * - category: exact match (tùy chọn)
 * - startDate/endDate: định dạng YYYY-MM-DD (tùy chọn)
 */
export const getExpensesByCategory = async (req: Request, res: Response) => {
  try {
    const { category, startDate, endDate } = req.query as {
      category?: string;
      startDate?: string;
      endDate?: string;
    };

    const where: any = {};
    if (category && category !== "All") {
      where.category = String(category);
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(`${startDate}T00:00:00.000Z`);
      if (endDate) where.date.lte = new Date(`${endDate}T23:59:59.999Z`);
    }

    const rows = await prisma.expenseByCategory.findMany({
      where,
      orderBy: { date: "desc" },
    });

    // Trả amount là number để frontend dùng thẳng
    const data = rows.map((item) => ({
      ...item,
      amount: Number(item.amount),
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving expenses by category" });
  }
};
