import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import LineChartBox from "../components/ReportsandAnalytics/LineChartBox";
import StatCard from "../components/ReportsandAnalytics/StatCard";
import TopSellingProducts from "../components/TopSellingProducts";
import { getLatestAnalyticsSnapshot } from "../api/analyticsApi";

const mockMonthlySales = [
  { month: "Jan", totalSales: 12000, totalOrders: 50, totalCustomers: 20, totalPurchases: 15 },
  { month: "Feb", totalSales: 15000, totalOrders: 65, totalCustomers: 25, totalPurchases: 10 },
  { month: "Mar", totalSales: 18000, totalOrders: 80, totalCustomers: 30, totalPurchases: 20 },
];

const initialAnalyticsState = {
  totalSales: 0,
  totalOrders: 0,
  salesReturn: 0,
  totalCustomers: 0,
  topSellingProducts: [],
  monthlySales: mockMonthlySales,
};

export const ReportsAnalytics = () => {
  const [analytics, setAnalytics] = useState(initialAnalyticsState);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("Monthly");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getLatestAnalyticsSnapshot(range);
        setAnalytics({
          ...res,
          monthlySales: res.monthlySales?.length ? res.monthlySales : mockMonthlySales,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  const sampleData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 50 },
  { name: "Apr", value: 85 },
  { name: "May", value: 42 },
  { name: "Jun", value: 65 },
  { name: "Jul", value: 18 },
];

  // We can simplify this since `analytics` is always initialized with data
  if (loading) return <p>Loading reports...</p>;

  const monthlySales = analytics.monthlySales || mockMonthlySales;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Reports & Analytics
        </h2>
        <button className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md border-gray-300">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{range}</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Sales"
          value={`₹ ${analytics.totalSales}`}
          data={monthlySales.map((m) => ({ name: m.month, value: m.totalPurchases }))}
          growth="20.8%"
        />
        <StatCard
          title="Orders Count"
          value={analytics.totalOrders}
          data={sampleData}
          growth="15%"
        />
        <StatCard
          title="Refund"
          value={analytics.salesReturn}
          data={monthlySales.map((m) => ({ name: m.month, value: m.totalPurchases }))}
          growth="0.3%"
          isNegative
        />
      </div>

      {/* Line charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <LineChartBox
          title="Total Sales"
          data={monthlySales.map((m) => ({ name: m.month, value: m.totalSales }))}
          total={analytics.totalSales}
        />
        <LineChartBox
          title="Customers"
          data={sampleData}
          total={analytics.totalCustomers}
        />
      </div>

      {/* Top Selling Products */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <TopSellingProducts products={analytics.topSellingProducts || []} />
      </div>
    </div>
  );
};