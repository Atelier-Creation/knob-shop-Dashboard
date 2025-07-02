import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Cell,
} from "recharts";
import { BarChart2 } from "lucide-react";

const data = [
  { name: "Jan", purchases: 100000, sales: 80000 },
  { name: "Feb", purchases: 50000, sales: 70000 },
  { name: "Mar", purchases: 100000, sales: 85000 },
  { name: "Apr", purchases: 20000, sales: 40000 },
  { name: "Jun", purchases: 75000, sales: 60000 },
  { name: "Jul", purchases: 100000, sales: 65000 },
  { name: "Aug", purchases: 20000, sales: 40000 },
  { name: "Sep", purchases: 90000, sales: 100000 },
];

// Unique colors per month
const purchaseColors = [
  "#3B82F6",
  "#FFA3A3",
  "#FFB95A",
  "#84CC16",
  "#22C55E",
  "#083684",
  "#8B5CF6",
  "#51009E",
];
const salesColors = [
  "#C0D8FF",
  "#EF4444",
  "#FFD8A4",
  "#D5FF94",
  "#71FFA5",
  "#8AB5FF",
  "#D5C2FF",
  "#E2C3FF",
];

const SalesPurchaseChart = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 md:p-5 w-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#d9d7ff] p-1 rounded-full">
            <BarChart2 size={18} className="text-[#6C63FF]" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">Sales & Purchase</h2>
        </div>

        <div className="flex flex-wrap gap-2 text-xs bg-gray-100 px-3 py-2 rounded-full">
          {["1D", "1W", "1M", "1Y"].map((label) => (
            <button
              key={label}
              className={`px-3 py-1 rounded-full cursor-pointer text-gray-600 ${
                label === "1Y"
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 justify-center mb-4">
        <div className="flex flex-wrap items-center gap-4 bg-gray-100 px-3 py-2 rounded-full text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#8da9ff] rounded-full"></span>
            Total Purchases
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#cbd5e1] rounded-full"></span>
            Total Sales
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] focus-visible:outline-none">
        <ResponsiveContainer width="100%" height="100%" className="focus-visible:outline-none">
          <BarChart data={data} barGap={4} className="focus-visible:outline-none">
            <CartesianGrid vertical={false} stroke="#C0C3CB" strokeDasharray="4 4" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
            <Tooltip />

            <Bar dataKey="purchases" radius={[4, 4, 0, 0]} barSize={24}>
              {data.map((_, idx) => (
                <Cell key={`p-${idx}`} fill={purchaseColors[idx % purchaseColors.length]} />
              ))}
            </Bar>
            <Bar dataKey="sales" radius={[4, 4, 0, 0]} barSize={24}>
              {data.map((_, idx) => (
                <Cell key={`s-${idx}`} fill={salesColors[idx % salesColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesPurchaseChart;
