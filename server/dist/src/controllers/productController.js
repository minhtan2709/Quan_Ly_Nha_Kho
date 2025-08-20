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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function normalizePrice(p) {
    return (p === null || p === void 0 ? void 0 : p.price) && typeof p.price === "object" && "toNumber" in p.price
        ? Object.assign(Object.assign({}, p), { price: p.price.toNumber() }) : p;
}
/** GET /api/products?q=&page=&limit= */
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const q = ((_b = (_a = req.query.q) !== null && _a !== void 0 ? _a : req.query.search) !== null && _b !== void 0 ? _b : "").toString().trim() || undefined;
        const page = Math.max(parseInt(String(req.query.page || "1")), 1);
        const limit = Math.max(Math.min(parseInt(String(req.query.limit || "50")), 100), 1);
        const skip = (page - 1) * limit;
        const where = q ? { name: { contains: q, mode: "insensitive" } } : undefined;
        const [items, total] = yield prisma.$transaction([
            prisma.products.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
            prisma.products.count({ where }),
        ]);
        res.setHeader("X-Total-Count", String(total));
        res.json(items.map(normalizePrice));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
/** GET /api/products/:id */
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.products.findUnique({ where: { productId: req.params.id } });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(normalizePrice(product));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error retrieving product" });
    }
});
exports.getProductById = getProductById;
/** POST /api/products */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, price, rating, imageUrl, stockQuantity } = req.body;
        if (!name)
            return res.status(400).json({ message: "name is required" });
        const data = {
            name: String(name),
            stockQuantity: stockQuantity != null ? Number(stockQuantity) : 0,
            rating: rating != null ? Number(rating) : null,
            imageUrl: imageUrl ? String(imageUrl) : null,
        };
        if (price != null)
            data.price = new client_1.Prisma.Decimal(String(price));
        if (productId)
            data.productId = String(productId);
        const created = yield prisma.products.create({ data });
        res.status(201).json(normalizePrice(created));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
/** PUT /api/products/:id */
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, rating, imageUrl, stockQuantity } = req.body;
        const data = {};
        if (name !== undefined)
            data.name = String(name);
        if (stockQuantity !== undefined)
            data.stockQuantity = Number(stockQuantity);
        if (rating !== undefined)
            data.rating = rating != null ? Number(rating) : null;
        if (imageUrl !== undefined)
            data.imageUrl = imageUrl ? String(imageUrl) : null;
        if (price !== undefined)
            data.price = new client_1.Prisma.Decimal(String(price));
        const updated = yield prisma.products.update({
            where: { productId: req.params.id },
            data,
        });
        res.json(normalizePrice(updated));
    }
    catch (e) {
        console.error(e);
        if ((e === null || e === void 0 ? void 0 : e.code) === "P2025")
            return res.status(404).json({ message: "Product not found" });
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
/** DELETE /api/products/:id */
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.products.delete({ where: { productId: req.params.id } });
        res.status(204).end();
    }
    catch (e) {
        console.error(e);
        if ((e === null || e === void 0 ? void 0 : e.code) === "P2025")
            return res.status(404).json({ message: "Product not found" });
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
