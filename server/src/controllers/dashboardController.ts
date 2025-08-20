import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ép Decimal → number an toàn
const toNumber = (x: any) => {
  if (x == null) return x;
  if (typeof x === "object" && "toNumber" in x) return x.toNumber();
  const n = Number(x);
  return Number.isNaN(n) ? x : n;
};

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const popularProductsRaw = await prisma.products.findMany({
      take: 15,
      orderBy: { stockQuantity: "desc" },
    });

    const salesSummaryRaw = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: { date: "desc" },
    });

    const purchaseSummaryRaw = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: { date: "desc" },
    });

    const expenseSummaryRaw = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: { date: "desc" },
    });

    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        take: 5,
        orderBy: { date: "desc" },
      }
    );

    // Chuẩn hóa số
    const popularProducts = popularProductsRaw.map((p: any) => ({
      ...p,
      price: toNumber(p.price),
      rating: p.rating != null ? Number(p.rating) : null,
      stockQuantity: Number(p.stockQuantity),
    }));

    const salesSummary = salesSummaryRaw.map((s: any) => ({
      ...s,
      totalValue: toNumber(s.totalValue),
      changePercentage:
        s.changePercentage != null ? Number(s.changePercentage) : null,
    }));

    const purchaseSummary = purchaseSummaryRaw.map((p: any) => ({
      ...p,
      totalPurchased: toNumber(p.totalPurchased),
      changePercentage:
        p.changePercentage != null ? Number(p.changePercentage) : null,
    }));

    const expenseSummary = expenseSummaryRaw.map((e: any) => ({
      ...e,
      totalExpenses: toNumber(e.totalExpenses),
      changePercentage:
        e.changePercentage != null ? Number(e.changePercentage) : null,
    }));

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item: any) => ({
        ...item,
        amount: toNumber(item.amount),
      })
    );

    res.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};
