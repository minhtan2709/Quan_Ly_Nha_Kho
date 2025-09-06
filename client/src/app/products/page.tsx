"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import Image from "next/image";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal, { EditProduct } from "./EditProductModal";

type Product = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number | null;
  imageUrl?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

type ToastState = { type: "success" | "error"; message: string } | null;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<EditProduct | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = (t: ToastState) => {
    setToast(t);
    if (t) {
      setTimeout(() => setToast(null), 2500);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const listUrl = useMemo(() => {
    const u = new URL(`${API_BASE}/products`, "http://dummy");
    if (debounced) u.searchParams.set("q", debounced);
    return u.pathname + (u.search ? u.search : "");
  }, [debounced]);

  // initial & search fetch
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const full =
          API_BASE.startsWith("http")
            ? `${API_BASE}/products${debounced ? `?q=${encodeURIComponent(debounced)}` : ""}`
            : listUrl;

        const r = await fetch(full, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json: Product[] = await r.json();
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Fetch failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [listUrl, debounced]);

  // CREATE (optimistic append + toast)
  const handleCreateProduct = async (payload: {
    name: string;
    price: number;
    stockQuantity: number;
    rating: number;
    imageUrl?: string;
  }) => {
    try {
      const r = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const created: Product = await r.json();

      // cập nhật list ngay
      setData((prev) => (prev ? [created, ...prev] : [created]));
      setIsCreateOpen(false);
      showToast({ type: "success", message: "Tạo sản phẩm thành công" });
    } catch (e: any) {
      showToast({ type: "error", message: `Tạo sản phẩm thất bại: ${e?.message || ""}` });
      // giữ modal mở để người dùng sửa
    }
  };

  // UPDATE (replace in place + toast)
  const handleUpdateProduct = async (
    id: string,
    payload: {
      name?: string;
      price?: number;
      stockQuantity?: number;
      rating?: number | null;
      imageUrl?: string | null;
    }
  ) => {
    try {
      const r = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const updated: Product = await r.json();

      setData((prev) =>
        prev ? prev.map((p) => (p.productId === id ? updated : p)) : [updated]
      );
      setIsEditOpen(false);
      setSelectedProduct(null);
      showToast({ type: "success", message: "Product update successful" });
    } catch (e: any) {
      showToast({ type: "error", message: `Product update failed: ${e?.message || ""}` });
      // giữ modal mở để chỉnh tiếp
    }
  };

  // DELETE (remove locally + toast)
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const r = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      setData((prev) => prev?.filter((p) => p.productId !== id) ?? null);
      showToast({ type: "success", message: "Product deleted successfully" });
    } catch (e: any) {
      showToast({ type: "error", message: `Delete failed: ${e?.message || ""}` });
    }
  };

  return (
    <div className="mx-auto pb-5 w-full">
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-30 px-4 py-3 rounded shadow text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      {loading && <div className="py-4">Loading...</div>}
      {err && !loading && (
        <div className="text-center text-red-500 py-4">
          Failed to fetch products: {err}
        </div>
      )}
      {!loading && !err && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
          {data?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.imageUrl || "/img/AYTT001-2.jpg"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36 object-cover"
                />
                <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
                <p className="text-gray-800">${Number(product.price).toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {product.stockQuantity}
                </div>
                {typeof product.rating === "number" && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                    onClick={() => {
                      setSelectedProduct(product as EditProduct);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => handleDeleteProduct(product.productId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateProduct}
      />

      {/* EDIT MODAL */}
      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={selectedProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}
