import {
  CalendarDays,
  Download,
  MessageCircle,
  Bell,
  Settings,
  MessageCircleMore,
  Search,
} from "lucide-react";

const Topbar = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white">
      {/* Left: Search */}
      <div className="flex items-center w-1/3">
        <div className="flex w-full bg-[#F7FAF9] border border-[#DFDFDF] border-r-0 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search here"
            className="flex-1 px-4 py-2 text-sm bg-transparent outline-none placeholder:text-gray-500"
          />
          <button className="bg-black text-white pe-5 ps-2 py-2 flex items-center justify-center">
           <Search/>
          </button>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-5">
        {/* Date */}
        <div className="flex items-center gap-2 border border-[#c0c0c0] ps-3 pe-2 py-1 rounded-full text-sm text-[#252525] font-semibold bg-[#F8F8F8]">
         {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })}
          <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center"><CalendarDays size={16} className="text-gray-600" /></div>
        </div>

        {/* Export Button */}
        <button className="flex items-center gap-1 text-sm text-[#252525] font-semibold">
          <Download size={18} className="me-1" />
          Export
        </button>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-700 ms-10">
          <MessageCircleMore size={20} />
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0 h-2 w-2 bg-red-500 rounded-full" />
          </div>
          <Settings size={20} />
        </div>

        {/* User */}
        <div className="flex items-center gap-2 ms-10 me-3">
          <div className="text-right text-sm">
            <p className="text-black font-medium">Luna</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
          <img
            src="/user-avatar.jpg"
            alt="User"
            className="w-8 h-8 rounded object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
