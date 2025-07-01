import { ChartLine, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const products = [
  {
    id: 1,
    name: "YDME100NxT",
    price: "₹ 89,299",
    sales: "+500 Sales",
    change: "+30% Last Month",
    chartData: [
      { day: "Sun", thisWeek: 400, lastWeek: 320 },
      { day: "Mon", thisWeek: 520, lastWeek: 400 },
      { day: "Tue", thisWeek: 390, lastWeek: 410 },
      { day: "Wed", thisWeek: 530, lastWeek: 430 },
      { day: "Thu", thisWeek: 460, lastWeek: 390 },
      { day: "Fri", thisWeek: 410, lastWeek: 370 },
      { day: "Sat", thisWeek: 480, lastWeek: 420 },
    ],
    changePercent: "30%",
    image: "/lock1.png",
    changeColor: "text-green-500",
  },
  {
    id: 2,
    name: "YDM4109A RL",
    price: "₹ 55,699",
    sales: "+200 Sales",
    change: "-10% Last Month",
    chartData: [
      { day: "Sun", thisWeek: 250, lastWeek: 300 },
      { day: "Mon", thisWeek: 270, lastWeek: 280 },
      { day: "Tue", thisWeek: 230, lastWeek: 260 },
      { day: "Wed", thisWeek: 290, lastWeek: 240 },
      { day: "Thu", thisWeek: 310, lastWeek: 220 },
      { day: "Fri", thisWeek: 280, lastWeek: 200 },
      { day: "Sat", thisWeek: 350, lastWeek: 230 },
    ],
    changePercent: "12%",
    image: "/lock2.png",
    changeColor: "text-red-500",
  },
  {
    id: 3,
    name: "Luna Pro",
    price: "₹ 97,199",
    sales: "+750 Sales",
    change: "+05% Last Month",
    chartData: [
      { day: "Sun", thisWeek: 400, lastWeek: 320 },
      { day: "Mon", thisWeek: 520, lastWeek: 400 },
      { day: "Tue", thisWeek: 390, lastWeek: 410 },
      { day: "Wed", thisWeek: 530, lastWeek: 430 },
      { day: "Thu", thisWeek: 460, lastWeek: 390 },
      { day: "Fri", thisWeek: 410, lastWeek: 370 },
      { day: "Sat", thisWeek: 480, lastWeek: 420 },
    ],
    changePercent: "15%",
    image: "/lock3.png",
    changeColor: "text-green-500",
  },
];

const TopSellingProducts = () => {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [open, setOpen] = useState(false);

  const ranges = ["Daily", "Weekly", "Monthly"];
  const toggleDropdown = () => setOpen(!open);

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
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Image + Info */}
            <div className="flex items-start md:items-center gap-4 md:w-1/3">
              <div className="bg-gray-200 w-16 h-16 min-w-16 min-h-16 p-1 rounded-md flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
              <div className="font-semibold text-gray-800 text-sm sm:text-xs whitespace-nowrap">
                {product.name}
              </div>
              <div className="text-sm sm:text-xs text-gray-500 whitespace-nowrap">
                {product.price}
              </div>
              <div className={`text-xs sm:text-[10px] whitespace-nowrap ${product.changeColor}`}>
                {product.change}
              </div>
            </div>

            </div>

            {/* Middle: Chart */}
            <div className="w-full md:w-2/3">
              <div className="bg-[#F6F6F6] rounded-xl p-2 w-full h-[80px] md:h-[120px]">
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
                      domain={[0, 640]}
                      ticks={[0, 200, 400, 600]}
                    />
                    <Tooltip
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
            <div className="ml-auto md:ml-4 text-white bg-green-500 px-3 py-1 rounded text-xs font-bold w-fit">
              {product.changePercent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
