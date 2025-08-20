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
exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ép Decimal → number an toàn
const toNumber = (x) => {
    if (x == null)
        return x;
    if (typeof x === "object" && "toNumber" in x)
        return x.toNumber();
    const n = Number(x);
    return Number.isNaN(n) ? x : n;
};
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularProductsRaw = yield prisma.products.findMany({
            take: 15,
            orderBy: { stockQuantity: "desc" },
        });
        const salesSummaryRaw = yield prisma.salesSummary.findMany({
            take: 5,
            orderBy: { date: "desc" },
        });
        const purchaseSummaryRaw = yield prisma.purchaseSummary.findMany({
            take: 5,
            orderBy: { date: "desc" },
        });
        const expenseSummaryRaw = yield prisma.expenseSummary.findMany({
            take: 5,
            orderBy: { date: "desc" },
        });
        const expenseByCategorySummaryRaw = yield prisma.expenseByCategory.findMany({
            take: 5,
            orderBy: { date: "desc" },
        });
        // Chuẩn hóa số
        const popularProducts = popularProductsRaw.map((p) => (Object.assign(Object.assign({}, p), { price: toNumber(p.price), rating: p.rating != null ? Number(p.rating) : null, stockQuantity: Number(p.stockQuantity) })));
        const salesSummary = salesSummaryRaw.map((s) => (Object.assign(Object.assign({}, s), { totalValue: toNumber(s.totalValue), changePercentage: s.changePercentage != null ? Number(s.changePercentage) : null })));
        const purchaseSummary = purchaseSummaryRaw.map((p) => (Object.assign(Object.assign({}, p), { totalPurchased: toNumber(p.totalPurchased), changePercentage: p.changePercentage != null ? Number(p.changePercentage) : null })));
        const expenseSummary = expenseSummaryRaw.map((e) => (Object.assign(Object.assign({}, e), { totalExpenses: toNumber(e.totalExpenses), changePercentage: e.changePercentage != null ? Number(e.changePercentage) : null })));
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => (Object.assign(Object.assign({}, item), { amount: toNumber(item.amount) })));
        res.json({
            popularProducts,
            salesSummary,
            purchaseSummary,
            expenseSummary,
            expenseByCategorySummary,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving dashboard metrics" });
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
