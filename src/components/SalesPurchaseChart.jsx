import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import noDataAnimation from "../assets/No_Data_found.json";
import { getChartData } from "../api/analyticsApi";

const purchaseColors = ["#3B82F6", "#FFA3A3", "#FFB95A", "#84CC16", "#22C55E", "#083684", "#8B5CF6", "#51009E"];
const salesColors = ["#C0D8FF", "#EF4444", "#FFD8A4", "#D5FF94", "#71FFA5", "#8AB5FF", "#D5C2FF", "#E2C3FF"];

const SalesPurchaseChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("1Y");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const result = await getChartData(filter);
        setData(result || []);
        console.log("sales and purchase chart data:", result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [filter]);

  const noData = !data || data.length === 0 || data.every((d) => !d.totalSales && !d.totalPurchases);

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 md:p-5 w-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#d9d7ff] p-1 rounded-full">
            <BarChart2 size={18} className="text-[#6C63FF]" />
          </div>
          <h2 className="font-semibold text-gray-800 text-sm">Sales Overview</h2>
        </div>

        <div className="flex flex-wrap gap-2 text-xs bg-gray-100 px-3 py-2 rounded-full">
          {["1D", "1W", "1M", "1Y"].map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`px-3 py-1 rounded-full cursor-pointer text-gray-600 ${
                filter === label ? "bg-black text-white" : "bg-white hover:bg-gray-50"
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
            <span className="w-2 h-2 bg-[#C0D8FF] rounded-full"></span>
            Total Sales
          </div>
        </div>
      </div>

      {/* Chart or Animation */}
      <div className="h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">Loading chart...</p>
        ) : noData ? (
          <div className="flex flex-col items-center justify-center">
            <Lottie animationData={noDataAnimation} loop autoplay style={{ height: 350, width: 350 }} />
            <p className="text-gray-500 text-sm mt-2">No sales data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid vertical={false} stroke="#C0C3CB" strokeDasharray="4 4" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
              <Tooltip
                formatter={(value, name) => {
                  const val = parseFloat(value || 0).toFixed(1);
                  if (name === "totalSales") return [val, "Total Sales"];
                  if (name === "totalPurchases") return [val, "Total Purchases"];
                  return [val, name];
                }}
              />
              <Bar dataKey="totalPurchases" radius={[4, 4, 0, 0]} barSize={24}>
                {data.map((_, idx) => (
                  <Cell key={`p-${idx}`} fill={purchaseColors[idx % purchaseColors.length]} />
                ))}
              </Bar>
              <Bar dataKey="totalSales" radius={[4, 4, 0, 0]} barSize={24}>
                {data.map((_, idx) => (
                  <Cell key={`s-${idx}`} fill={salesColors[idx % salesColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesPurchaseChart;
