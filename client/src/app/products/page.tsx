"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import Image from "next/image";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import CreateProductModal from "./CreateProductModal";

type Product = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number | null;
  imageUrl?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // debounce 300ms cho thanh search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const listUrl = useMemo(() => {
    const u = new URL(`${API_BASE}/products`, "http://dummy");
    if (debounced) u.searchParams.set("q", debounced);
    // trả về path đầy đủ (bỏ host giả)
    return u.pathname + (u.search ? u.search : "");
  }, [debounced]);

  // fetch dữ liệu
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
    return () => {
      alive = false;
    };
  }, [listUrl, debounced]);

  // Handler tạo product mới (POST /products) — đã thêm imageUrl
 const handleCreateProduct = async (payload: {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  imageUrl?: string;            // <-- thêm
}) => {
  try {
    const r = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),  // <- gửi luôn imageUrl nếu có
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    setSearchTerm((s) => s); // reload list
  } catch (e: any) {
    alert(`Tạo sản phẩm thất bại: ${e?.message || ""}`);
  } finally {
    setIsModalOpen(false);
  }
};

  return (
    <div className="mx-auto pb-5 w-full">
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
          onClick={() => setIsModalOpen(true)}
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
                  src={product.imageUrl || "/img/AYTT001-2.jpg"} // ưu tiên ảnh từ DB
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36 object-cover"
                />
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">${Number(product.price).toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {product.stockQuantity}
                </div>
                {typeof product.rating === "number" && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}   // modal cần truyền cả imageUrl về đây
      />
    </div>
  );
}
