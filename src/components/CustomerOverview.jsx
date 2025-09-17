import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Smile,
  ChevronUp,
  ChevronDown,
  Laugh,
  Frown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getLatestAnalyticsSnapshot } from "../api/analyticsApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CustomerOverview() {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [open, setOpen] = useState(false);
   const menuRef = useRef();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const ranges = ["Daily", "Weekly", "Monthly"];
  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getLatestAnalyticsSnapshot(selectedRange);
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedRange]);

  if (loading || !analytics) {
  return (
    <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-white w-full max-w-4xl mx-auto space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gray-200 w-8 h-8" />
          <div className="h-4 bg-gray-300 rounded w-40" />
        </div>
        <div className="flex gap-4">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-20" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bars */}
        <div className="flex items-end gap-2 w-full md:w-2/3 min-h-[150px]">
          <div className="flex-1 bg-gray-200 rounded-md h-24" />
          <div className="flex-1 bg-gray-300 rounded-md h-16" />
        </div>

        {/* Stats & Chart Skeleton */}
        <div className="w-full flex flex-col justify-between gap-4">
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-md w-full bg-gray-100 border border-gray-200 px-2 py-3 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-12 bg-gray-300 rounded" />
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2 items-center mt-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="w-full mt-4">
            <div className="h-4 w-40 bg-gray-300 rounded mb-2" />
            <div className="h-[150px] bg-gray-200 rounded-md border border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}


const { newCustomers = 0, returningCustomers = 0, customerSatisfaction = {} } = analytics || {};

const barMax = Math.max(newCustomers, returningCustomers, 1);
const normNew = (newCustomers / barMax) * 150;
const normReturn = (returningCustomers / barMax) * 150;

const chartData =
  customerSatisfaction.trend?.length > 0
    ? customerSatisfaction.trend
    : [
        { day: "Sun", value: customerSatisfaction.averageRating ?? 4.5 },
        { day: "Mon", value: customerSatisfaction.averageRating ?? 4.5 },
        { day: "Tue", value: customerSatisfaction.averageRating ?? 4.5 },
        { day: "Wed", value: customerSatisfaction.averageRating ?? 4.5 },
        { day: "Thu", value: customerSatisfaction.averageRating ?? 4.5 },
        { day: "Fri", value: customerSatisfaction.averageRating ?? 4.5 },
        { day: "Sat", value: customerSatisfaction.averageRating ?? 4.5 },
      ];



  return (
    <div className="p-4 rounded-2xl border border-[#E5E5E5] bg-white w-full max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex justify-between flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-green-200">
            <Users className="text-green-500" size={16} />
          </div>
          <h2 className="text-lg font-semibold">Customer Overview</h2>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="#" className="text-gray-500 hover:underline">
            View More
          </a>
          <div className="relative" ref={menuRef}>
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

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bars */}
        <div className="flex items-end gap-2 w-full md:w-2/3 min-h-[150px]">
          <div className="flex-1 bg-green-100 rounded-md flex items-end">
            <div
              className="bg-green-500 w-full rounded-md"
              style={{ height: `${normNew+5}px` }}
            ></div>
          </div>
          <div className="flex-1 bg-red-100 rounded-md flex items-end">
            <div
              className="bg-red-500 w-full rounded-md"
              style={{ height: `${normReturn+5}px` }}
            ></div>
          </div>
        </div>

        {/* Stats & Chart */}
        <div className="w-full flex flex-col justify-between gap-4">
          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* First-Time Buyers */}
            <div className="rounded-md flex flex-col justify-between w-full bg-gray-50 border border-gray-100 px-2 py-3">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{newCustomers}</div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="ml-1">
                    {customerSatisfaction.changeNewPct ?? "+0%"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 items-center">
                <div className="rounded-full p-1 bg-green-200 w-6 h-6 flex justify-center items-center">
                  <Laugh size={14} color="#04A057" />
                </div>
                <div className="text-gray-500 text-xs">First-Time Buyers</div>
              </div>
            </div>

            {/* Returning Customers */}
            <div className="rounded-md flex flex-col justify-between w-full bg-gray-50 border border-gray-100 px-2 py-3">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{returningCustomers}</div>
                <div className="flex items-center text-red-500 text-sm">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="ml-1">
                    {customerSatisfaction.changeReturnPct ?? "-0%"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 items-center">
                <div className="rounded-full p-1 bg-red-200 w-6 h-6 flex justify-center items-center">
                  <Frown size={14} color="#FD4234" />
                </div>
                <div className="text-gray-500 text-xs">Returning Customers</div>
              </div>
            </div>
          </div>

          {/* Satisfaction Line Chart */}
          <div className="w-full mt-4">
            <div className="flex items-center gap-2 mb-2 text-gray-600 text-sm">
              <Smile className="w-4 h-4 text-yellow-500" />
              Customer Satisfaction
            </div>
            <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
