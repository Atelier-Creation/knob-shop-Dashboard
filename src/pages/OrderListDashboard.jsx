import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays,
  Search,
  CircleCheck,
  CircleDollarSign,
  Clock,
  CheckCircle,
  Loader2,
  ShoppingCart,
  RotateCcw,
  XCircle,
  ShieldOff,
  MoreVertical,
} from "lucide-react";
import StatusBadge from "../components/orderListDashboard/StatusBadge";
import { ActionMenu } from "../components/orderListDashboard/ActionMenu";
import Dropdown from "../components/Dropdown";
import StatCardGroup from "../components/orderListDashboard/StatCardGroup";
import ResponsiveTableCard from "../components/ResponsiveTableCard";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../api/orderListApi";

const columns = [
  { label: "Order ID" },
  { label: "Customer" },
  { label: "Total" },
  { label: "Payment Status" },
  { label: "Order Date" },
  { label: "View More" },
  { label: "Actions" },
];

const tabs = [{ label: "All" }, { label: "Success", icon: CircleCheck }];

export default function OrderListDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("All"); // 🕓 New state
  const navigate = useNavigate();

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrders();
        setOrders(res.orders || []); // Adjust key if different
        console.log("all orders", res);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSort = (key) => {
    if (sortField === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortOrder("asc");
    }
  };

  const filteredOrders = useMemo(() => {
  const now = new Date();

  // 🗓️ Last 7 days (rolling week, including today)
  const endOfWeek = new Date();
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfWeek = new Date();
  startOfWeek.setDate(endOfWeek.getDate() - 6); // 7 days ago
  startOfWeek.setHours(0, 0, 0, 0);

  // 🗓️ Current month range
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return orders.filter((order) => {
    const customer = order?.userId?.name || "";
    const id = order?.orderId || "";
    const orderStatus = order?.status || "";
    const paymentStat = order?.paymentStatus || "";
    const date = new Date(order?.createdAt);
    const total = order?.totalAmount ?? "";

    // 🟢 Tab filter
    const statusMatch =
      activeTab === "All" ||
      (activeTab === "Confirmed"
        ? paymentStat.toLowerCase() === "success"
        : orderStatus.toLowerCase() === "confirmed");

    // 🟣 Payment status filter
    const paymentMatch =
      paymentStatus === "All" ||
      paymentStat.toLowerCase() === paymentStatus.toLowerCase();

    // 🕓 Time filter (updated)
    const timeMatch =
      timeFilter === "All" ||
      (timeFilter === "This Week (last 7D)" && date >= startOfWeek && date <= endOfWeek) ||
      (timeFilter === "This Month" && date >= startOfMonth && date <= endOfMonth);

    // 🔍 Search filter
    const searchMatch =
      customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentStat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      total.toString().toLowerCase().includes(searchTerm.toLowerCase());

    setCurrentPage(1);
    return statusMatch && paymentMatch && timeMatch && searchMatch;
  });
}, [orders, activeTab, paymentStatus, searchTerm, timeFilter]);


  const computedFailedOrders = useMemo(() => {
    const abandoned = orders.filter((o) => o.status === "Abandoned").length;
    const returned = orders.filter((o) => o.status === "Returned").length;
    const canceled = orders.filter((o) => o.status === "Cancelled").length;
    const damaged = orders.filter((o) => o.status === "Damaged").length;

    return [
      {
        label: "Abandoned",
        value: abandoned.toLocaleString(),
        icon: ShoppingCart,
        iconColor: "text-indigo-500",
      },
      {
        label: "Returned",
        value: returned.toLocaleString(),
        icon: RotateCcw,
        iconColor: "text-emerald-500",
      },
      {
        label: "Cancelled",
        value: canceled.toLocaleString(),
        icon: XCircle,
        iconColor: "text-rose-500",
      },
      {
        label: "Damaged",
        value: damaged > 0 ? damaged.toLocaleString() : "–",
        icon: ShieldOff,
        iconColor: "text-indigo-400",
      },
    ];
  }, [orders]);

  const computedOrderStatuses = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;

    return [
      {
        label: "Total Orders",
        value: total.toLocaleString(),
        icon: CircleDollarSign,
        iconColor: "text-indigo-500",
      },
      {
        label: "Pending",
        value: pending.toLocaleString(),
        icon: Clock,
        iconColor: "text-emerald-500",
      },
      {
        label: "Confirmed",
        value: confirmed.toLocaleString(),
        icon: CheckCircle,
        iconColor: "text-blue-500",
      },
      {
        label: "cancelled",
        value: cancelled.toLocaleString(),
        icon: Loader2,
        iconColor: "text-rose-500",
      },
    ];
  }, [orders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getPagination = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("left-ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("right-ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <h2 className="text-xl font-semibold">
          Orders & Customers / <span className="font-normal">Orders List</span>
        </h2>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium">Export</button>
          <div className="flex items-center gap-2 text-sm border rounded px-3 py-1">
            <CalendarDays size={16} /> Jul 01 – Jul 03
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatCardGroup title="Order Statuses" stats={computedOrderStatuses} />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`px-2 py-2 text-sm flex items-center gap-1 cursor-pointer ${
              activeTab === label
                ? "border-b-2 border-black text-black font-medium"
                : "text-gray-500"
            }`}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 ${
                  activeTab === label ? "text-green-600" : "text-gray-600"
                }`}
              />
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3 mb-4">
        <div className="flex items-center w-full md:w-1/3 max-w-full rounded-full border border-gray-400 overflow-hidden">
          <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 text-sm bg-white w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-black p-3 flex items-center justify-center text-white">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full md:w-1/4">
          <Dropdown
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            options={[
              "All",
              "success",
              "Pending",
              "failure",
              "refund",
              "timeout",
            ]}
            islable={false}
          />
        </div>

        {/* 🕓 New Time Filter */}
        <div className="w-full md:w-1/4">
          <Dropdown
            label="Time Filter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            options={["All", "This Week (last 7D)", "This Month"]}
            islable={false}
          />
        </div>
      </div>

      {/* Table */}
      <ResponsiveTableCard
        data={paginatedOrders}
        columns={columns}
        renderRow={(order) => (
          <>
            <td className="p-3 font-medium text-black whitespace-nowrap">
              {order.orderId}
            </td>
            <td className="p-3">{order?.userId?.name}</td>
            <td className="p-3">{Number(order?.finalAmount).toFixed(2)}</td>
            <td className="p-3">
              <StatusBadge status={order.paymentStatus} orderId={order._id} />
            </td>
            <td className="p-3">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="p-3">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer"
                title="View Details"
                onClick={() =>
                  navigate(
                    `/orders-customers/order-list/${order._id.replace("#", "")}`
                  )
                }
              >
                View Details
              </button>
            </td>
            <td className="p-3 relative">
              <ActionMenu
                isOpen={selectedMenu === order._id}
                onClose={() => setSelectedMenu(null)}
                onToggle={() =>
                  setSelectedMenu(selectedMenu === order._id ? null : order._id)
                }
              />
            </td>
          </>
        )}
        renderCard={(paginatedOrders) => (
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold">{paginatedOrders._id}</h3>
              <ActionMenu
                isOpen={selectedMenu === paginatedOrders._id}
                onClose={() => setSelectedMenu(null)}
                onToggle={() =>
                  setSelectedMenu(
                    selectedMenu === paginatedOrders._id
                      ? null
                      : paginatedOrders._id
                  )
                }
              />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium text-gray-900">Customer:</span>{" "}
                {paginatedOrders?.userId?.name}
              </div>
              <div>
                <span className="font-medium text-gray-900">Total:</span>{" "}
                {Number(paginatedOrders.totalAmount).toFixed(2)}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  Order Status:
                </span>{" "}
                <StatusBadge
                  status={paginatedOrders.status}
                  orderId={paginatedOrders._id}
                />
              </div>
              <div>
                <span className="font-medium text-gray-900">Date:</span>{" "}
                {new Date(paginatedOrders.createdAt).toLocaleDateString()}
              </div>
              <div className="p-1">
                <button
                  className="bg-blue-500 text-white px-2 py-2 w-full rounded text-xs cursor-pointer"
                  title="View Details"
                  onClick={() =>
                    navigate(
                      `/orders-customers/order-list/${paginatedOrders.id.replace(
                        "#",
                        ""
                      )}`
                    )
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </>
        )}
      />

      {/* Pagination */}
      <div className="flex flex-col-reverse gap-4 md:flex-row justify-between items-center pt-4">
        <p className="text-xs text-gray-500">
          Showing{" "}
          {filteredOrders.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
          {filteredOrders.length} entries
        </p>
        <div className="flex gap-2 text-sm">
          <button
            className="px-3 py-1 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {getPagination().map((p, i) =>
            p === "left-ellipsis" || p === "right-ellipsis" ? (
              <span key={i} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  currentPage === p
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
