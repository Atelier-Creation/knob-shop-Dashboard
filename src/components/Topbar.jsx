// Topbar.jsx (fixed localStorage quota + de-dup + safe writes)
import {
  CalendarDays,
  Bell,
  Menu,
  LogOut,
  User,
  X,
  Download,
} from "lucide-react";
import ProfileModal from "./ProfileModal";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./logout";
import axios from "axios";
import { getUnseenOrders, markOrderAsSeen } from "../api/orderListApi";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("https://knob-shop-backend.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("🔌 Connected to backend with ID:", socket.id);
});

const NOTIF_KEY = "notifications";
const MAX_NOTIFS = 100; // cap stored notifications to avoid quota exceed

const Topbar = ({ toggleSidebar, onSearch }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef();
  const notifRef = useRef();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  // Helper: safe localStorage set with size limit + try/catch
  const persistNotifications = (arr) => {
    try {
      const capped = Array.isArray(arr) ? arr.slice(0, MAX_NOTIFS) : [];
      localStorage.setItem(NOTIF_KEY, JSON.stringify(capped));
    } catch (err) {
      // If quota exceeded or write failed, attempt a trimmed write
      try {
        const trimmed = (arr || []).slice(0, Math.min(20, MAX_NOTIFS));
        localStorage.setItem(NOTIF_KEY, JSON.stringify(trimmed));
        console.warn("localStorage write trimmed to avoid quota:", trimmed.length);
      } catch (err2) {
        console.warn("Failed to persist notifications to localStorage", err2);
        // If still failing, just skip persisting to localStorage
      }
    }
  };

  // Helper: dedupe notifications by `id` (keep first occurrence)
  const dedupeNotifications = (arr) => {
    const seen = new Set();
    const out = [];
    for (const n of arr) {
      const id = n?.id ?? n?.orderId ?? JSON.stringify(n);
      if (!seen.has(id)) {
        seen.add(id);
        out.push(n);
      }
    }
    return out;
  };

  // Load notifications from localStorage on mount (safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const capped = parsed.slice(0, MAX_NOTIFS);
          setNotifications(dedupeNotifications(capped));
        }
      }
    } catch (err) {
      console.warn("Failed to read notifications from localStorage", err);
      setNotifications([]);
    }
  }, []);

  // click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URI}/products/search/${value}`
      );
      setResults(data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
      setResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
      setResults([]);
    }
  };

  const handleclick = (item) => {
    try {
      localStorage.setItem("selectedCategoryId", item?.category?._id ?? "");
      localStorage.setItem("selectedCategoryName", item?.category?.category_name ?? "");
    } catch (err) {
      // swallow storage write errors
    }
    navigate(`/products/${item?._id}/edit`);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  // Fetch unseen orders on mount
  useEffect(() => {
    let mounted = true;
    const fetchUnseen = async () => {
      try {
        const res = await getUnseenOrders();
        if (res?.success && Array.isArray(res.orders) && res.orders.length > 0) {
          const newNotifications = res.orders.map((order) => ({
            id: order._id,
            orderId: order.orderId,
            totalAmount: order.totalAmount,
            message: `Missed Order #${order.orderId} – ₹${order.totalAmount}`,
            createdAt: order.createdAt || new Date().toISOString(),
          }));

          setNotifications((prev) => {
            const merged = dedupeNotifications([...newNotifications, ...prev]);
            const capped = merged.slice(0, MAX_NOTIFS);
            persistNotifications(capped);
            return capped;
          });

          toast.success(`You have ${res.orders.length} unseen orders!`, {
            duration: 8000,
          });
        }
      } catch (err) {
        console.error("Failed to fetch unseen orders", err);
      }
    };

    if (mounted) fetchUnseen();

    return () => {
      mounted = false;
    };
  }, []);

  // Socket: newOrder
  useEffect(() => {
    const TOAST_ID = "newOrderToast";

    const handler = (data) => {
      if (!data) return;
      const notif = {
        id: data._id ?? data.orderId ?? `${Date.now()}`,
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        message: `New Order #${data.orderId} – ₹${data.totalAmount}`,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => {
        const merged = dedupeNotifications([notif, ...prev]);
        const capped = merged.slice(0, MAX_NOTIFS);
        persistNotifications(capped);
        return capped;
      });

      // Dismiss previous and show a compact toast
      toast.dismiss(TOAST_ID);
      toast(
        (t) => (
          <div className="flex justify-between items-center gap-2">
            <span>{notif.message}</span>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-500 hover:text-gray-900 font-bold"
            >
              X
            </button>
          </div>
        ),
        { id: TOAST_ID, duration: 10000 }
      );
    };

    socket.on("newOrder", handler);

    return () => {
      socket.off("newOrder", handler);
    };
  }, []);

  // Mark as seen handler (called when clicking the small X per notif)
  const handleMarkAsSeen = async (n, e) => {
    if (e) e.stopPropagation();
    try {
      // backend call (best-effort)
      if (n?.orderId) await markOrderAsSeen(n.orderId);
    } catch (err) {
      console.error("Failed to mark order as seen", err);
    } finally {
      const updated = notifications.filter((x) => x.id !== n.id && x.orderId !== n.orderId);
      setNotifications(updated);
      persistNotifications(updated);
    }
  };

  // Open notification details
  const handleOpenNotification = (n) => {
    setNotifOpen(false);
    navigate(`/orders-customers/order-list/${n.id || n.orderId}`);
  };

  return (
    <header className="flex justify-between items-center gap-2 px-4 py-3 bg-white">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-3 flex-1 md:flex-none">
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <div className="relative flex bg-[#F7FAF9] border border-[#DFDFDF] rounded-full w-full min-w-sm">
          <input
            type="search"
            placeholder="Search..."
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 text-sm bg-transparent outline-none placeholder:text-gray-500 rounded-l-full"
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-black text-white px-4 py-2 flex items-center justify-center rounded-r-full"
          >
            <i className="bi bi-search" />
          </button>

          {/* Dropdown Results */}
          {query && (
            <ul className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-100 overflow-y-auto z-50">
              {loading ? (
                <li className="px-4 py-2 text-gray-500">Searching...</li>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => {
                      handleclick(item);
                      setQuery("");
                      setResults([]);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                  >
                    <img
                      src={
                        item?.images?.[0] ||
                        item?.category?.categoryImageUrl ||
                        "/fallback.jpg"
                      }
                      alt={item.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span>{item.name}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found.</li>
              )}
            </ul>
          )}
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
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen((s) => !s)} className="relative top-1">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2 font-semibold border-b border-gray-200">Notifications</div>

                {notifications.length === 0 ? (
                  <p className="p-2 text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id || n.orderId}
                      className="p-2 text-sm border-b border-gray-100 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div
                        onClick={() => handleOpenNotification(n)}
                        className="cursor-pointer flex-1"
                      >
                        <p>{n.message}</p>
                        <p className="text-xs text-gray-400">
                          Order #{n.orderId} – ₹{n.totalAmount}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleMarkAsSeen(n, e)}
                        className="text-gray-400 hover:text-gray-600 font-bold"
                        title="Mark as seen"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <svg width="1" height="28" className="text-gray-200"><rect width="1" height="28" /></svg>
          </div>

          <div className="hidden md:block">
            <button title="Settings">
              {/* Settings icon space kept simple */}
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <div onClick={() => setOpen((s) => !s)} className="flex items-center gap-2 cursor-pointer">
            <div className="hidden md:block text-right text-sm">
              <p className="text-black font-medium">Admin</p>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>
            <img src="/user-avatar.jpg" alt="User" className="w-8 h-8 rounded-full object-cover" />
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-50">
              <button
                title="Profile"
                onClick={() => {
                  setShowProfileModal(true);
                  setOpen(false);
                }}
                className="w-full inline-flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <User /> Profile
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-full inline-flex items-center gap-2 text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-100 cursor-pointer"
              >
                <LogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </header>
  );
};

export default Topbar;
