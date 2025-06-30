import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import SalesPurchaseChart from "../components/SalesPurchaseChart";
import CustomerOverview from "../components/CustomerOverview";

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [open, setOpen] = useState(false);

  const ranges = ["Daily", "Weekly", "Monthly"];

  const toggleDropdown = () => setOpen(!open);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Topbar />
        <div className="bg-[#FAFDFD] rounded-2xl my-3 me-2 h-full overflow-y-auto scrollbar-thick">
          <main className="p-6 space-y-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <div className="flex gap-4">
                <button className="bg-black text-white px-4 py-2 rounded-sm leading-none">
                {" "}
                <Plus className="inline-block" size={18} /> Add New
              </button>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-1 border border-gray-800 bg-white px-4 py-2 rounded-sm text-gray-700 focus:outline-none"
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

            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Total Sales" value="2,00,000" change={25} />
              <StatCard
                title="Sales Return"
                value="16,000"
                change={15}
                changeType="down"
              />
              <StatCard
                title="Total Purchase"
                value="16,000"
                change={15}
                changeType="down"
              />
              <StatCard
                title="Purchase Return"
                value="17,000"
                change={10}
                changeType="down"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <SalesPurchaseChart/>
                <CustomerOverview/>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
