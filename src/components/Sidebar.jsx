import {
  LayoutDashboard,
  Package,
  MonitorSmartphone,
  Percent,
  Boxes,
  BarChart2,
  Users,
  Star,
  Truck,
  Download,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  { label: "Categories & Products", icon: <Package size={20} />, path: "/categories-products" },
  { label: "Homepage Ads", icon: <MonitorSmartphone size={20} />, path: "/homepage-ads" },
  { label: "Deals & Discounts", icon: <Percent size={20} />, path: "/deals-discounts" },
  { label: "Product & Stock", icon: <Boxes size={20} />, path: "/product-stock" },
  { label: "Reports & Analytics", icon: <BarChart2 size={20} />, path: "/reports-analytics" },
  { label: "Orders & Customers", icon: <Users size={20} />, path: "/orders-customers" },
  { label: "Reviews & Ratings", icon: <Star size={20} />, path: "/reviews-ratings" },
  { label: "Shipping & Tax", icon: <Truck size={20} />, path: "/shipping-tax" },
];

const Sidebar = () => {
  return (
    <aside className="w-[280px] h-screen bg-white px-3 flex flex-col justify-start shadow-sm">
      {/* Logo */}
      <div className="mb-6 mt-4 px-9">
        <img src="/logo.svg" alt="Knobs Shop" className="w-[152px] h-[84px]" />
      </div>

      {/* Welcome Message */}
      <div className="mb-4 text-left px-8">
        <h2 className="text-4xl font-bold text-gray-800">Welcome</h2>
        <h1 className="text-4xl font-bold text-gray-800 leading-tight">Back, Luna</h1>
        <p className="text-[12px] text-gray-400 mt-1 flex items-center">
          Last Update, 21 Jun 2025
          <span className="w-5 h-5 ms-1 inline-block"><Download size={20} /></span>
        </p>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin bg-[#FAFDFD] rounded-2xl">
          <nav className="flex flex-col gap-2 p-3.5">
            {navItems.map(({ label, icon, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium ${
                    isActive
                      ? "bg-[#FFE3CC] text-[#783904]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
                  }`
                }
              >
                <span className="w-5 h-5">{icon}</span>
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
