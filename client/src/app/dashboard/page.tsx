"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

type Product = {
  productId: string;
  name: string;
  price: number;
  rating?: number | null;
  stockQuantity: number;
  imageUrl?: string | null;
};

type SalesSummary = {
  date: string;
  totalValue: number;
  changePercentage?: number | null;
};

type PurchaseSummary = {
  date: string;
  totalPurchased: number;
  changePercentage?: number | null;
};

type ExpenseSummary = {
  date: string;
  totalExpenses: number;
  changePercentage?: number | null;
};

type ExpenseByCategorySummary = {
  date: string;
  category: string;
  amount: number;
};

type DashboardMetrics = {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"; // <- luôn có "/api" nếu same-origin
const ENDPOINT = `${API_BASE}/dashboard`; // <- KHÔNG còn nhánh else "/dashboard"

export default function Dashboard() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await fetch(ENDPOINT, { cache: "no-store" });
        const ct = r.headers.get("content-type") || "";
        if (!r.ok) {
          // Nếu server trả HTML (404 page) cũng r.ok=false
          const text = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} – ${text.slice(0, 120)}`);
        }
        // Chắn chắc là JSON, tránh lỗi "Unexpected token '<'"
        if (!ct.includes("application/json")) {
          const text = await r.text().catch(() => "");
          throw new Error(
            `Non-JSON response (content-type="${ct}"). Sample: ${text.slice(0, 120)}`
          );
        }
        const json: DashboardMetrics = await r.json();
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
  }, []);

  if (loading) return <div className="m-5">Loading...</div>;
  if (err || !data)
    return (
      <div className="m-5 text-red-500">
        Failed to fetch dashboard: {err}
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts products={data.popularProducts} />
      <CardSalesSummary sales={data.salesSummary} />
      <CardPurchaseSummary purchases={data.purchaseSummary} />
      <CardExpenseSummary
        expenseSummary={data.expenseSummary}
        expenseByCategorySummary={data.expenseByCategorySummary}
      />

      <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Customer Growth",
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "10.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "147",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Sales",
            amount: "1000.00",
            changePercentage: 20,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "200.00",
            changePercentage: -10,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
}
