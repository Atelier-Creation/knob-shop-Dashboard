import {
  CalendarDays,
  Download,
  MessageCircleMore,
  Bell,
  Settings,
  Search,
  Menu,
} from "lucide-react";

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="flex justify-between items-center gap-2 px-4 py-3 bg-white">
      {/* Left: Menu + Search (mobile-first) */}
      <div className="flex items-center gap-3 flex-1 md:flex-none">
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="flex bg-[#F7FAF9] border border-[#DFDFDF] rounded-full overflow-hidden w-full max-w-xs">
          <input
            type="text"
            placeholder="Search here"
            className="flex-1 px-4 py-2 text-sm bg-transparent outline-none placeholder:text-gray-500"
          />
          <button className="bg-black text-white px-3 py-2 flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 border border-[#c0c0c0] ps-3 pe-2 py-1 rounded-full text-sm text-[#252525] font-semibold bg-[#F8F8F8]">
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center">
            <CalendarDays size={16} className="text-gray-600" />
          </div>
        </div>

        <button className="hidden md:flex items-center gap-1 text-sm text-[#252525] font-semibold">
          <Download size={18} /> Export
        </button>

        <div className="flex items-center gap-4 text-gray-700">
          <MessageCircleMore size={20} className="hidden md:block" />
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0 h-2 w-2 bg-red-500 rounded-full" />
          </div>
          <Settings size={20} className="hidden md:block" />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right text-sm">
            <p className="text-black font-medium">Luna</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
          <img
            src="/user-avatar.jpg"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
