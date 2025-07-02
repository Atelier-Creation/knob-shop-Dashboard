import StatCard from "../components/StatCard";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import SalesPurchaseChart from "../components/SalesPurchaseChart";
import CustomerOverview from "../components/CustomerOverviewContainer";
import TopSellingProducts from "../components/TopSellingProducts";
import CurrentOrdersStatus from "../components/CurrentOrdersStatus";

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [open, setOpen] = useState(false);
  const ranges = ["Daily", "Weekly", "Monthly"];

  const toggleDropdown = () => setOpen(!open);

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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Sales" value="2,00,000" change={25} />
        <StatCard title="Sales Return" value="16,000" change={15} changeType="down" />
        <StatCard title="Total Purchase" value="16,000" change={15} changeType="down" />
        <StatCard title="Purchase Return" value="17,000" change={10} changeType="down" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SalesPurchaseChart />
        <CustomerOverview />
      </div>

      {/* Products & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TopSellingProducts />
        <CurrentOrdersStatus />
      </div>
    </>
  );
};

export default Dashboard;
