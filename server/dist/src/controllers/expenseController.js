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
exports.getExpensesByCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * GET /api/expenses?category=Office&startDate=2025-08-01&endDate=2025-08-31
 * - category: exact match (tùy chọn)
 * - startDate/endDate: định dạng YYYY-MM-DD (tùy chọn)
 */
const getExpensesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, startDate, endDate } = req.query;
        const where = {};
        if (category && category !== "All") {
            where.category = String(category);
        }
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(`${startDate}T00:00:00.000Z`);
            if (endDate)
                where.date.lte = new Date(`${endDate}T23:59:59.999Z`);
        }
        const rows = yield prisma.expenseByCategory.findMany({
            where,
            orderBy: { date: "desc" },
        });
        // Trả amount là number để frontend dùng thẳng
        const data = rows.map((item) => (Object.assign(Object.assign({}, item), { amount: Number(item.amount) })));
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving expenses by category" });
    }
});
exports.getExpensesByCategory = getExpensesByCategory;
