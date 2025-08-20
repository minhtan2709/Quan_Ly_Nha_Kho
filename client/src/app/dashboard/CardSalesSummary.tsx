import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesSummary = {
  date: string;
  totalValue: number;
  changePercentage?: number | null;
};

export default function CardSalesSummary({
  sales,
}: {
  sales: SalesSummary[];
}) {
  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum = sales.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);

  const averageChangePercentage =
    sales.length > 0
      ? sales.reduce((acc, curr) => acc + (curr.changePercentage || 0), 0) /
        sales.length
      : 0;

  const highestValueData =
    sales.reduce(
      (acc, curr) => (acc.totalValue > curr.totalValue ? acc : curr),
      sales[0] || ({ totalValue: 0 } as SalesSummary)
    ) || null;

  const highestValueDate = highestValueData?.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">Sales Summary</h2>
        <hr />
      </div>

      {/* BODY */}
      <div>
        {/* BODY HEADER */}
        <div className="flex justify-between items-center mb-6 px-7 mt-5">
          <div className="text-lg font-medium">
            <p className="text-xs text-gray-400">Value</p>
            <span className="text-2xl font-extrabold">
              $
              {(totalValueSum / 1_000_000).toLocaleString("en", {
                maximumFractionDigits: 2,
              })}
              m
            </span>
            <span className="text-green-500 text-sm ml-2">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {averageChangePercentage.toFixed(2)}%
            </span>
          </div>
          <select
            className="shadow-sm border border-gray-300 bg-white p-2 rounded"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={350} className="px-7">
          <BarChart
            data={sales}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tickFormatter={(value) => {
                return `$${(Number(value) / 1_000_000).toFixed(0)}m`;
              }}
              tick={{ fontSize: 12, dx: -1 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v: number) => [`$${Number(v).toLocaleString("en")}`]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }}
            />
            <Bar dataKey="totalValue" fill="#3182ce" barSize={10} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div>
        <hr />
        <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
          <p>{sales.length || 0} days</p>
          <p className="text-sm">
            Highest Sales Date: <span className="font-bold">{highestValueDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
