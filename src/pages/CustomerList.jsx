import React, { useState, useMemo, useEffect } from "react";
import { CalendarDays, Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUser } from "../api/frontUserApi";
import ResponsiveTableCard from "../components/ResponsiveTableCard";
import { ActionMenu } from "../components/orderListDashboard/ActionMenu";
import StatCardGroup from "../components/orderListDashboard/StatCardGroup";
import { getOrdersByUserId } from '../api/orderListApi'
import profileImage from '../assets/pi.png'
const columns = [
  { label: "Profile" },
  { label: "Name" },
  { label: "Email" },
  { label: "Phone" },
  { label: "Order Count" },
];
const tabs = [
    { label: "All" },
    { label: "Customers" },
    { label: "Only Users" },
  ];

function CustomerList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [stats, setStats] = useState({ customers: 0, onlyUsers: 0 });
  const [activeTab, setActiveTab] = useState("All");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUser();
        const allUsers = res.data.users || [];
        let customersCount = 0;
        let onlyUsersCount = 0;
  
        // attach orderCount to each user
        const usersWithOrders = await Promise.all(
          allUsers.map(async (user) => {
            try {
              const orderRes = await getOrdersByUserId(user._id);
              const orders = orderRes?.orders || [];
              if (orders.length > 0) {
                customersCount++;
              } else {
                onlyUsersCount++;
              }
              return { ...user, orderCount: orders.length }; // 👈 attach order count
            } catch (err) {
              console.error("Error fetching orders for user:", user._id, err);
              onlyUsersCount++;
              return { ...user, orderCount: 0 };
            }
          })
        );
  
        setUsers(usersWithOrders);
        setStats({ customers: customersCount, onlyUsers: onlyUsersCount });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  // Search filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const tabMatch =
        activeTab === "All" ||
        (activeTab === "Customers" && user.orderCount > 0) ||
        (activeTab === "Only Users" && user.orderCount === 0);

      return searchMatch && tabMatch;
    });
  }, [users, searchTerm, activeTab]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <h2 className="text-xl font-semibold">
          Users & Customers / <span className="font-normal">Customer List</span>
        </h2>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium">Export</button>
          <div className="flex items-center gap-2 text-sm border rounded px-3 py-1">
            <CalendarDays size={16} /> Aug 01 – Aug 21
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <StatCardGroup
        title="Users Overview"
        stats={[
          {
            label: "Total Users",
            value: users.length,
            icon: CalendarDays,
            iconColor: "text-indigo-500",
          },
          {
            label: "Customers",
            value: stats.customers,
            icon: CalendarDays,
            iconColor: "text-green-500",
          },
          {
            label: "Only Users",
            value: stats.onlyUsers,
            icon: CalendarDays,
            iconColor: "text-red-500",
          },
        ]}
      />
      <StatCardGroup
        title="Users Overview"
        stats={[
          {
            label: "Total Users",
            value: users.length,
            icon: CalendarDays,
            iconColor: "text-indigo-500",
          },
          {
            label: "Customers",
            value: stats.customers,
            icon: CalendarDays,
            iconColor: "text-green-500",
          },
          {
            label: "Only Users",
            value: stats.onlyUsers,
            icon: CalendarDays,
            iconColor: "text-red-500",
          },
        ]}
      />
</div>
<div className="flex gap-4  mb-4">
        {tabs.map(({ label }) => (
          <button
            key={label}
            onClick={() => {
              setActiveTab(label);
              setCurrentPage(1); // reset to first page
            }}
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === label
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3 mb-4">
        <div className="flex items-center w-full md:w-1/3 max-w-full rounded-full border border-gray-400 overflow-hidden">
          <input
            type="text"
            placeholder="Search users"
            className="px-4 py-2 text-sm bg-white w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-black p-3 flex items-center justify-center text-white">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ResponsiveTableCard
  data={paginatedUsers}
  columns={columns}
  renderRow={(user) => (
    <>
      <td className="p-3">
        <img
        src={user.profileUrl || profileImage}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="p-3 font-medium text-black whitespace-nowrap">
        {user.name}
      </td>
      <td className="p-3">{user.email ? user.email : "-"}</td>
      <td className="p-3">{user.phone ? user.phone : "-"}</td>
      <td className="p-3">{user.orderCount}</td>

    </>
  )}
  renderCard={(user) => (
    <div key={user._id} className="p-4 border rounded-lg space-y-2">
      <div className="flex items-center gap-3">
        <img
        src={user.profileUrl || profileImage}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">{user.phone}</p>
          <p className="text-sm text-gray-500">Orders: {user.orderCount}</p>

        </div>
      </div>
    </div>
  )}
/>


      {/* Pagination */}
      <div className="flex flex-col-reverse gap-4 md:flex-row justify-between items-center pt-4">
        <p className="text-xs text-gray-500">
          Showing{" "}
          {filteredUsers.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
        </p>
        <div className="flex gap-2 text-sm">
          <button
            className="px-3 py-1 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({
            length: Math.ceil(filteredUsers.length / itemsPerPage),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 cursor-pointer"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredUsers.length / itemsPerPage))
              )
            }
            disabled={
              currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
