"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Settings, Search } from "lucide-react";

type Product = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const url = useMemo(() => {
    const u = new URL(`${API_BASE}/products`, "http://dummy");
    if (debounced) u.searchParams.set("q", debounced);
    return u.pathname + (u.search ? u.search : "");
  }, [debounced]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const full = API_BASE.startsWith("http") ? `${API_BASE}${url}` : url;
        const r = await fetch(full, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: Product[] = await r.json();
        if (alive) setRows(data);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Fetch failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [url]);

  const columns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: "",
      width: 64,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (p: GridRenderCellParams<any, Product>) => {
        const src = p.row.imageUrl || "/img/AYTT001-2.jpg";
        return (
          <img
            src={src}
            alt={p.row.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      field: "productId",
      headerName: "ID",
      width: 280,
      valueFormatter: (value: any) => {
        const v = value || "";
        return v.length > 10 ? `${v.slice(0, 40)}...` : v;
      },
    },
    { field: "name", headerName: "Product Name", flex: 1, minWidth: 220 },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      type: "number",
      align: "left",
      headerAlign: "left",
      valueFormatter: (value: any) =>
        value == null ? "" : `$${Number(value).toFixed(2)}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      valueFormatter: (value: any) => (value == null ? "N/A" : value),
    },
    {
      field: "stockQuantity",
      headerName: "Stock",
      width: 110,
      type: "number",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* search + settings */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 mr-2 text-gray-500" />
          <input
            className="w-full outline-none text-sm"
            placeholder="Start type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="rounded-xl border border-gray-300 bg-white p-2 shadow-sm hover:bg-gray-50"
          aria-label="Settings"
          type="button"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <Header name="Inventory" />

      {err && (
        <div className="text-center text-red-500 py-4">
          Failed to fetch products: {err}
        </div>
      )}

      <div className="mt-3">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.productId}
          loading={loading}
          checkboxSelection
          disableColumnMenu
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          className="bg-white shadow rounded-xl border border-gray-200 !text-gray-700"
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f7f7f7",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            },
            "& .MuiDataGrid-cell": {
              outline: "none !important",
            },
          }}
        />
      </div>
    </div>
  );
}
