import { useState } from "react";
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
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
  {
    label: "Categories & Products",
    icon: <Package size={20} />,
    children: [
      { label: "Add Products", path: "/categories-products/add" },
      { label: "Add category", path: "/categories-products/category" },
      { label: "Product List", path: "/categories-products/product-list" },
      { label: "Bulk Upload", path: "/categories-products/bulk-add-product" },
      { label: "Product Status", path: "/categories-products/product-status" },
      { label: "Filters", path: "/categories-products/filters" },
    ],
  },
  {
    label: "Homepage Ads",
    icon: <MonitorSmartphone size={20} />,
    path: "/homepage-ads",
  },
  {
    label: "Deals & Discounts",
    icon: <Percent size={20} />,
    path: "/deals-discounts",
  },
  {
    label: "Product & Stock",
    icon: <Boxes size={20} />,
    path: "/product-stock",
  },
  {
    label: "Reports & Analytics",
    icon: <BarChart2 size={20} />,
    path: "/reports-analytics",
  },
  {
    label: "Orders & Customers",
    icon: <Users size={20} />,
    path: "/orders-customers",
  },
  {
    label: "Reviews & Ratings",
    icon: <Star size={20} />,
    path: "/reviews-ratings",
  },
  { label: "Shipping & Tax", icon: <Truck size={20} />, path: "/shipping-tax" },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expanded, setExpanded] = useState(null);

  const handleExpand = (label) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <div
        onClick={toggleSidebar}
        className={clsx(
          "fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity",
          isOpen ? "block" : "hidden"
        )}
      ></div>

      <aside
        className={clsx(
          "fixed z-40 top-0 left-0 h-screen w-[280px] bg-white shadow-sm px-3 flex flex-col justify-start transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:block"
        )}
      >
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="mb-6 mt-4 px-9">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="Knobs Shop"
              className="w-[152px] h-[84px]"
            />
          </Link>
        </div>

        <div className="mb-4 text-left px-8">
          <h2 className="text-4xl font-bold text-gray-800">Welcome</h2>
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Back, Luna
          </h1>
          <p className="text-[12px] text-gray-400 mt-1 flex items-center">
            Last Update, 21 Jun 2025
            <span className="w-5 h-5 ms-1 inline-block">
              <Download size={20} />
            </span>
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-[#FAFDFD] rounded-2xl">  
            <nav className="flex flex-col gap-2 p-3.5">
              {navItems.map(({ label, icon, path, children }) => {
                const isExpanded = expanded === label;

                return (
                  <div key={label}>
                    {children ? (
                      <button
                        type="button"
                        onClick={() => handleExpand(label)}
                        className={clsx(
                          "flex items-center cursor-pointer gap-3 px-4 py-3 rounded-full text-sm font-medium w-full text-left",
                          isExpanded
                            ? "bg-[#ffefe3] text-[#783904]"
                            : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
                        )}
                      >
                        <span className="w-5 h-5">{icon}</span>
                        <span className="truncate">{label}</span>
                      </button>
                    ) : (
                      <NavLink
                        to={path}
                        onClick={() => {
                          toggleSidebar();
                          setExpanded(null); // Close any open submenu
                        }}
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
                    )}

                    {children && isExpanded && (
                      <div className="relative ms-6 mt-2 ps-3 border-l-2 border-[#783904]/30 space-y-2">
                        {children.map((sub) => (
                          <NavLink
                            key={sub.label}
                            to={sub.path}
                            onClick={() => {
                              if (isOpen) toggleSidebar();
                            }}
                            className={({ isActive }) =>
                              `relative flex items-center gap-2 text-sm rounded-full ps-4 py-2 ${
                                isActive
                                  ? "bg-[#FFE3CC] text-[#783904]"
                                  : "text-gray-600 hover:text-orange-500 hover:bg-gray-100"
                              }`
                            }
                          >
                            <span className="absolute left-[-19px] top-3 w-3 h-3 border-2 border-[#783904] rounded-full bg-white" />
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
