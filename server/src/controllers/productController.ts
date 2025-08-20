import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

function normalizePrice(p: any) {
  return p?.price && typeof p.price === "object" && "toNumber" in p.price
    ? { ...p, price: p.price.toNumber() }
    : p;
}

/** GET /api/products?q=&page=&limit= */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q ?? req.query.search ?? "").toString().trim() || undefined;
    const page = Math.max(parseInt(String(req.query.page || "1")), 1);
    const limit = Math.max(Math.min(parseInt(String(req.query.limit || "50")), 100), 1);
    const skip = (page - 1) * limit;

    const where = q ? { name: { contains: q, mode: "insensitive" as const } } : undefined;

    const [items, total] = await prisma.$transaction([
      prisma.products.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.products.count({ where }),
    ]);

    res.setHeader("X-Total-Count", String(total));
    res.json(items.map(normalizePrice));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

/** GET /api/products/:id */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.products.findUnique({ where: { productId: req.params.id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(normalizePrice(product));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

/** POST /api/products */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { productId, name, price, rating, imageUrl, stockQuantity } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const data: any = {
      name: String(name),
      stockQuantity: stockQuantity != null ? Number(stockQuantity) : 0,
      rating: rating != null ? Number(rating) : null,
      imageUrl: imageUrl ? String(imageUrl) : null,
    };
    if (price != null) data.price = new Prisma.Decimal(String(price));
    if (productId) data.productId = String(productId);

    const created = await prisma.products.create({ data });
    res.status(201).json(normalizePrice(created));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error creating product" });
  }
};

/** PUT /api/products/:id */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, rating, imageUrl, stockQuantity } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = String(name);
    if (stockQuantity !== undefined) data.stockQuantity = Number(stockQuantity);
    if (rating !== undefined) data.rating = rating != null ? Number(rating) : null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl ? String(imageUrl) : null;
    if (price !== undefined) data.price = new Prisma.Decimal(String(price));

    const updated = await prisma.products.update({
      where: { productId: req.params.id },
      data,
    });
    res.json(normalizePrice(updated));
  } catch (e: any) {
    console.error(e);
    if (e?.code === "P2025") return res.status(404).json({ message: "Product not found" });
    res.status(500).json({ message: "Error updating product" });
  }
};

/** DELETE /api/products/:id */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.products.delete({ where: { productId: req.params.id } });
    res.status(204).end();
  } catch (e: any) {
    console.error(e);
    if (e?.code === "P2025") return res.status(404).json({ message: "Product not found" });
    res.status(500).json({ message: "Error deleting product" });
  }
};
