import {
  Info,
  Users,
  ShoppingCart,
  User,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const CustomerOverview = () => {
  return (
    <div className="grid gap-4">
      {/* Overall Information */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-900">Overall Information</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-[#0C1D2C] text-white">
            <div>
              <h3 className="text-lg font-bold">10,090</h3>
              <div className="flex items-center gap-1">
                <Users size={18} className="text-black" />
                <p className="text-xs mt-1">Suppliers</p>
              </div>
            </div>
            <div className="bg-white p-1 rounded-full">
              <svg width="16" height="16" fill="none" stroke="black"><path d="M6 4l4 4-4 4" strokeWidth="2" /></svg>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-[#EFEFEF] text-gray-900 hover:shadow">
            <div>
              <h3 className="text-lg font-bold">989</h3>
              <div className="flex items-center gap-1">
                <User size={18} className="text-black" />
                <p className="text-xs mt-1">Customer</p>
              </div>
            </div>
            <div className="bg-white p-1 rounded-full">
              <svg width="16" height="16" fill="none" stroke="black"><path d="M6 4l4 4-4 4" strokeWidth="2" /></svg>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-[#EFEFEF] text-gray-900 hover:shadow">
            <div>
              <h3 className="text-lg font-bold">567</h3>
              <div className="flex items-center gap-1">
                <ShoppingCart size={18} className="text-black" />
                <p className="text-xs mt-1">Orders</p>
              </div>
            </div>
            <div className="bg-white p-1 rounded-full">
              <svg width="16" height="16" fill="none" stroke="black"><path d="M6 4l4 4-4 4" strokeWidth="2" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Overview */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-green-500" />
            <h2 className="text-sm font-semibold text-gray-900">Customer Overview</h2>
          </div>
          <button className="text-sm px-3 py-1.5 border border-gray-400 rounded-full">
            Weekly ▼
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {/* First-Time & Returning Bar Graphs */}
          <div className="flex gap-1 col-span-2">
            <div className="bg-[#C4F0D4] rounded-xl h-40 flex items-end justify-center">
              <div className="bg-[#29AB87] w-full rounded-b-xl h-36"></div>
            </div>
            <div className="bg-[#FFECEC] rounded-xl h-40 flex items-end justify-center">
              <div className="bg-[#F44336] w-full rounded-b-xl h-24"></div>
            </div>
          </div>

          {/* Buyer Info Boxes + Line Chart */}
          <div className="col-span-3 grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              {/* First-Time Buyers */}
              <div className="flex justify-between items-center bg-[#F6F6F6] p-3 rounded-xl">
                <div>
                  <p className="text-xl font-semibold text-gray-900">1,834</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <User size={14} className="text-green-500" />
                    First-Time Buyers
                  </p>
                </div>
                <div className="text-green-500 text-xs flex items-center gap-1 font-medium">
                  <TrendingUp size={14} /> +12%
                </div>
              </div>

              {/* Returning Customers */}
              <div className="flex justify-between items-center bg-[#F6F6F6] p-3 rounded-xl">
                <div>
                  <p className="text-xl font-semibold text-gray-900">218</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <User size={14} className="text-red-500" />
                    Returning Customers
                  </p>
                </div>
                <div className="text-red-500 text-xs flex items-center gap-1 font-medium">
                  <TrendingDown size={14} /> -05%
                </div>
              </div>
            </div>

            {/* Satisfaction Line Chart */}
            <div className="bg-[#F6F6F6] rounded-xl p-3">
              <p className="text-sm font-medium mb-1 flex items-center gap-1 text-gray-800">
                😊 Customer Satisfaction
              </p>
              <svg width="100%" height="80" viewBox="0 0 120 40">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points="0,30 10,32 20,25 30,27 40,20 50,22 60,18 70,25 80,15 90,18 100,12 110,25 120,10"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
