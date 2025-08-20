"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type ExpenseByCategorySummary = {
  // Nếu backend có id thì thêm vào; không bắt buộc
  id?: string;
  category: string;
  date: string;   // ISO string
  amount: number; // number (đã convert ở backend)
};

type AggregatedDataItem = {
  name: string;
  amount: number;
  color?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function ExpensesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [rows, setRows] = useState<ExpenseByCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Build URL cho backend (không phụ thuộc RTK hook)
  const url = useMemo(() => {
    const u = new URL(`${API_BASE}/expenses`, "http://dummy");
    if (selectedCategory && selectedCategory !== "All") {
      u.searchParams.set("category", selectedCategory);
    }
    if (startDate) u.searchParams.set("startDate", startDate);
    if (endDate) u.searchParams.set("endDate", endDate);
    return u.pathname + (u.search ? u.search : "");
  }, [selectedCategory, startDate, endDate]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const full = API_BASE.startsWith("http") ? `${API_BASE}${url}` : url;
        const r = await fetch(full, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json: ExpenseByCategorySummary[] = await r.json();
        if (alive) setRows(json);
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

  // Gom nhóm KHÔNG dùng Map/iterator ⇒ tránh lỗi --downlevelIteration
  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    // (1) Nếu muốn lọc thêm phía client (ngoài API) thì làm tại đây:
    const filtered = rows; // backend đã filter theo query

    // (2) Gom bằng object thuần (ES5-friendly)
    const acc: { [cat: string]: AggregatedDataItem } = {};
    for (let i = 0; i < filtered.length; i++) {
      const row = filtered[i];
      const key = row.category;
      const amount = Number(row.amount || 0);

      if (!acc[key]) {
        acc[key] = {
          name: key,
          amount: 0,
          color: `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")}`,
        };
      }
      acc[key].amount += amount;
    }

    // (3) Trả mảng bằng Object.keys() (ES5)
    const keys = Object.keys(acc);
    const out: AggregatedDataItem[] = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) out[i] = acc[keys[i]];
    return out;
  }, [rows]);

  const classNames = {
    label: "block text-sm font-medium text-gray-700",
    input:
      "mt-1 block w-full px-3 py-2 text-base border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
  };

  if (loading) return <div className="py-4">Loading...</div>;
  if (err)
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses: {err}
      </div>
    );

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5">
        <Header name="Expenses" />
        <p className="text-sm text-gray-500">
          A visual representation of expenses over time.
        </p>
      </div>

      {/* FILTERS + CHART */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* FILTER CARD */}
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Filter by Category and Date
          </h3>

          <div className="space-y-4">
            {/* CATEGORY */}
            <div>
              <label htmlFor="category" className={classNames.label}>
                Category
              </label>
              <select
                id="category"
                name="category"
                className={classNames.input}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>Office</option>
                <option>Professional</option>
                <option>Salaries</option>
              </select>
            </div>

            {/* START DATE */}
            <div>
              <label htmlFor="start-date" className={classNames.label}>
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className={classNames.input}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* END DATE */}
            <div>
              <label htmlFor="end-date" className={classNames.label}>
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className={classNames.input}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
          {aggregatedData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No data available for selected filters.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={aggregatedData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={150}
                  dataKey="amount"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {aggregatedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === activeIndex ? "rgb(29, 78, 216)" : entry.color
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* (Tuỳ chọn) Bảng dữ liệu gốc để kiểm tra nhanh */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-3">Raw data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id || i} className="border-t">
                  <td className="px-3 py-2">
                    {new Date(r.date).toISOString().split("T")[0]}
                  </td>
                  <td className="px-3 py-2">{r.category}</td>
                  <td className="px-3 py-2">
                    ${Number(r.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                    No records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
