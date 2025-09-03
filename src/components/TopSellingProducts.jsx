import React, { useEffect, useState } from "react";
import { getLatestAnalyticsSnapshot } from "../api/analyticsApi";
import { ChartLine, ChevronDown, ChevronUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

const TopSellingProducts = () => {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [topProducts, setTopProducts] = useState([]);

  const toggleDropdown = () => setOpen(!open);
  const ranges = ["Daily", "Weekly", "Monthly"];

  const fetchAnalytics = async (range) => {
    setLoading(true);
    try {
      const { topSellingProducts } = await getLatestAnalyticsSnapshot(range);
      console.log(topSellingProducts);

      const updatedProducts = topSellingProducts.map((product, index) => ({
        id: product.productId || index,
        name: product.name,
        price: `₹ ${product.price?.toLocaleString()}`,
        sales: `+${product.soldQty} Sales`,
        change: `${product.changeRate >= 0 ? "+" : ""}${
          product.changeRate
        }% Last Month`,
        changePercent: `${product.changeRate}%`,
        changeColor:
          product.changeRate >= 0 ? "text-green-500" : "text-red-500",
        chartData: [
          {
            day: "Sun",
            thisWeek: product.revenue,
            lastWeek: product.revenue * 0.8,
          },
          {
            day: "Mon",
            thisWeek: product.revenue * 0.9,
            lastWeek: product.revenue * 0.6,
          },
          {
            day: "Tue",
            thisWeek: product.revenue * 0.85,
            lastWeek: product.revenue * 0.5,
          },
          {
            day: "Wed",
            thisWeek: product.revenue * 0.95,
            lastWeek: product.revenue * 0.7,
          },
          {
            day: "Thu",
            thisWeek: product.revenue * 0.8,
            lastWeek: product.revenue * 0.6,
          },
          {
            day: "Fri",
            thisWeek: product.revenue * 0.75,
            lastWeek: product.revenue * 0.65,
          },
          {
            day: "Sat",
            thisWeek: product.revenue,
            lastWeek: product.revenue * 0.9,
          },
        ],
        image: product?.image,
      }));
      console.log(topSellingProducts);
      setTopProducts(updatedProducts);
    } catch (err) {
      console.error("Failed to fetch top selling products", err);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 p-3 border border-gray-200 rounded-xl animate-pulse bg-white">
      <div className="flex items-start md:items-center gap-4 w-full md:w-1/3">
        <div className="bg-gray-200 w-16 h-16 rounded-md" />
        <div className="space-y-2 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <div className="bg-gray-100 rounded-xl h-[120px]" />
      </div>

      <div className="w-14 h-6 bg-gray-300 rounded-md" />
    </div>
  );

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-[#E5E5E5] w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#f380392d] p-2 rounded-full">
            <ChartLine size={18} color="#F38139" />
          </div>
          <span className="text-sm font-semibold text-gray-800">
            Top Selling Products
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            This Week
            <span className="w-2 h-2 bg-red-400 rounded-full ml-2" />
            Last Week
          </span>

          <button className="text-gray-700 text-xs underline">View More</button>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center cursor-pointer gap-1 border border-gray-300 hover:border-[#914200] px-3 py-1 rounded-full text-xs text-gray-700"
            >
              {selectedRange}
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {open && (
              <ul className="absolute z-50 right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md text-xs">
                {ranges.map((range) => (
                  <li
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedRange === range
                        ? "font-semibold text-[#b15000]"
                        : ""
                    }`}
                  >
                    {range}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="flex flex-col gap-y-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : topProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 md:p-0 p-3 md:rounded-none rounded-2xl md:border-0 border border-gray-100 md:shadow-none shadow"
              >
                {/* Left: Image + Info */}
                <div className="flex items-start md:items-center gap-4 w-full md:w-1/3">
                  <div className="bg-gray-200 w-16 h-16 min-w-16 min-h-16 p-1 rounded-md flex items-center justify-center">
                    <img
                      src={product.image || null}
                      alt={product.name || null}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 text-sm sm:text-xs truncate">
                      {product.name || null}
                    </div>
                    <div className="text-sm sm:text-xs text-gray-500 truncate">
                      {product.price || null}
                    </div>
                    <div
                      className={`text-xs sm:text-[10px] truncate ${product.changeColor}`}
                    >
                      {product.change || null}
                    </div>
                  </div>
                </div>

                {/* Middle: Chart */}
                <div className="w-full md:w-2/3">
                  <div className="bg-[#F6F6F6] rounded-xl p-2 w-full h-[120px] md:h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={product.chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                      >
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#555", dy: 8 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#888" }}
                          domain={[0, "auto"]}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={false}
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            border: "1px solid #e5e5e5",
                            fontSize: 12,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="thisWeek"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="lastWeek"
                          stroke="#f87171"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: % Box */}
                <div
                  className={`md:ml-4 mt-2 md:mt-0 text-white ${
                    product.changeColor.includes("green")
                      ? "bg-green-500"
                      : "bg-red-500"
                  } px-3 py-1 rounded text-xs font-bold w-fit self-start md:self-auto`}
                >
                  {product.changePercent}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
