import { RefreshCcw, ChevronDown, ArrowUpRight, ChevronUp, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import { useState } from "react";

const StatCard = ({ title, value, change, changeType = "up" }) => {
  const isUp = changeType === "up";
  const changeColor = isUp ? "text-green-600" : "text-red-600";
  const ChangeIcon = isUp ? ArrowUpToLine : ArrowDownToLine;

  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [open, setOpen] = useState(false);

  const ranges = ["Daily", "Weekly", "Monthly"];

  const toggleDropdown = () => setOpen(!open);

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-3 w-full hover:border-[#914200] transition-colors duration-300 cursor-pointer flex justify-between flex-col">
      {/* Top: Title and Dropdown */}
       <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm font-medium text-gray-800">{title}</span>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 border border-gray-300 hover:border-[#914200] px-3 py-1 rounded-full text-sm text-gray-700 focus:outline-none"
          >
            {selectedRange}
           {!open? <ChevronDown size={14}/>: <ChevronUp size={14}/>}
          </button>

          {open && (
            <ul className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md text-sm">
              {ranges.map((range) => (
                <li
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedRange === range ? "font-medium text-[#b15000]" : ""
                  }`}
                >
                  {range}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Middle: Icon, Amount, Change */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#DFF6F5] flex items-center justify-center">
            <RefreshCcw size={14} className="text-[#3BC8C4]" />
          </div>
          <span className="text-[22px] font-bold text-gray-900">₹ {value.toLocaleString()}</span>
        </div>
        <div className={`flex items-center text-sm font-medium ${changeColor}`}>
          <ChangeIcon size={14} className="mr-1" />
          {change}%
        </div>
      </div>

      {/* Divider */}
      {/* <div className=""></div> */}

      {/* Bottom: Description + Link */}
      <div className="border-t border-gray-200 pt-2 flex items-center justify-between text-xs text-gray-500">
        <span>Sales return vs Last month</span>
        <a href="#" className="flex items-center text-blue-500 hover:underline">
          View all
          <ArrowUpRight size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default StatCard;
