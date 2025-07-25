import { Calendar } from "lucide-react";
import LineChartBox from "../components/ReportsandAnalytics/LineChartBox";
import StatCard from "../components/ReportsandAnalytics/StatCard";
import TopSellingProducts from "../components/TopSellingProducts";

const sampleData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 50 },
  { name: "Apr", value: 85 },
  { name: "May", value: 42 },
  { name: "Jun", value: 65 },
  { name: "Jul", value: 18 },
];
const RefundData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 15 },
];
export const ReportsAnalytics = () => {
  return (
    <>
      <div className=" min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Reports & Analytics
          </h2>
          <button className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-md border-gray-300">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Jul 01 - Jul 03</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Sales"
            value="₹ 2,996"
            data={sampleData}
            growth="20.8%"
          />
          <StatCard
            title="Orders Count"
            value="45"
            data={sampleData}
            growth="15%"
          />
          <StatCard
            title="Refund"
            value="02"
            data={RefundData}
            growth="0.3%"
            isNegative
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <LineChartBox title="Total Sales" data={sampleData} total="100K" />
          <LineChartBox title="Customers" data={sampleData} total="900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <TopSellingProducts />
        </div>
      </div>
    </>
  );
};
