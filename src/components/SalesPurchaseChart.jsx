import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { BarChart2 } from "lucide-react";

const data = [
  { name: "Jan", purchases: 100000, sales: 80000 },
  { name: "Feb", purchases: 50000, sales: 70000 },
  { name: "Mar", purchases: 100000, sales: 85000 },
  { name: "Apr", purchases: 20000, sales: 40000 },
  { name: "Jun", purchases: 75000, sales: 60000 },
  { name: "Jul", purchases: 100000, sales: 65000 },
  { name: "Aug", purchases: 0, sales: 0 },
  { name: "Sep", purchases: 90000, sales: 100000 },
];

const SalesPurchaseChart = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#d9d7ff] p-1 rounded-full"><BarChart2 size={18} className="text-[#6C63FF]" /></div>
          <h2 className="font-semibold text-gray-800 text-sm">Sales & Purchase</h2>
        </div>

        {/* Time Range Buttons */}
        <div className="flex gap-2 text-xs">
          {["1D", "1W", "1M", "1Y"].map((label, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-full border text-gray-600 ${
                label === "1Y"
                  ? "bg-black text-white"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 bg-[#B3C3FF] rounded-full"></span>
          Total Purchases
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-3 h-3 bg-[#CFCFCF] rounded-full"></span>
          Total Sales
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="4 4" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
          <Tooltip />
          <Bar dataKey="purchases" fill="#B3C3FF" radius={[4, 4, 0, 0]} barSize={24} />
          <Bar dataKey="sales" fill="#CFCFCF" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPurchaseChart;
