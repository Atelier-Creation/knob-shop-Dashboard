import StatCard from "../components/StatCard";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import SalesPurchaseChart from "../components/SalesPurchaseChart";
import CustomerOverview from "../components/CustomerOverviewContainer";
import TopSellingProducts from "../components/TopSellingProducts";
import CurrentOrdersStatus from "../components/CurrentOrdersStatus";
import { getLatestAnalyticsSnapshot } from "../api/analyticsApi";
const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const ranges = ["Daily", "Weekly", "Monthly"];

  const toggleDropdown = () => setOpen(!open);
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLatestAnalyticsSnapshot(selectedRange);
      console.log("analytics data : ",data)
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedRange, fetchAnalytics]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };
  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>

        <div className="flex flex-wrap gap-3">
          <button className="bg-black text-white px-4 py-2 rounded-sm text-sm flex items-center gap-2">
            <Plus size={18} /> Add New
          </button>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 border border-gray-800 bg-white px-4 py-2 rounded-sm text-gray-700 text-sm"
            >
              {selectedRange}
              {!open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>

            {open && (
              <ul className="absolute z-50 right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md text-sm">
                {ranges.map((range) => (
                  <li
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedRange === range
                        ? "font-medium text-[#b15000]"
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

      {loading ? (
        <>
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-md border border-gray-200 shadow-sm bg-white animate-pulse space-y-4"
              >
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-6 w-3/4 bg-gray-300 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-md border border-gray-200 shadow-sm bg-white animate-pulse"
              ></div>
            ))}
          </div>

          {/* Products & Orders Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-md border border-gray-200 shadow-sm bg-white animate-pulse"
              ></div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Sales"
              value={analytics?.totalSales || 0}
              change={analytics?.changeStats?.totalSales || 0}
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
            />
            <StatCard
              title="Total Products Sold"
              value={analytics?.totalProductsSold || 0}
              change={Math.abs(analytics?.changeStats?.totalProductsSold || 0)}
              changeType={
                analytics?.changeStats?.salesReturn < 0 ? "down" : "up"
              }
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
            />
            <StatCard
              title="AverageOrder Value"
              value={analytics?.averageOrderValue || 0}
              change={Math.abs(analytics?.changeStats?.averageOrderValue || 0)}
              changeType={
                analytics?.changeStats?.totalPurchase < 0 ? "down" : "up"
              }
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
            />
            <StatCard
              title="AverageRevenue Per Customer"
              value={analytics?.averageRevenuePerCustomer || 0}
              change={Math.abs(analytics?.changeStats?.averageRevenuePerCustomer || 0)}
              changeType={
                analytics?.changeStats?.purchaseReturn < 0 ? "down" : "up"
              }
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SalesPurchaseChart data={analytics?.monthlySales} />
            <CustomerOverview data={analytics?.customerSatisfaction} />
          </div>

          {/* Products & Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TopSellingProducts data={analytics?.topSellingProducts} />
            <CurrentOrdersStatus data={analytics?.orderStatusSummary} />
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
