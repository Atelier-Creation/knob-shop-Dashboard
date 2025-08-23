import {
  CalendarDays,
  Download,
  MessageCircleMore,
  Bell,
  Settings,
  Search,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./logout";
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
const Topbar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef();
  const notifRef = useRef();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate); // or inline logout logic
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

// Inside your Topbar component
useEffect(() => {
  // Load notifications from localStorage on mount
  const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
  setNotifications(savedNotifications);
}, []);
  // ✅ Fetch unseen orders when admin logs in / page mounts
  useEffect(() => {
    const fetchUnseen = async () => {
      try {
        const res = await getUnseenOrders();
        if (res.success && res.orders.length > 0) {
          res.orders.forEach((order) => {
            const notif = {
              id: order._id,
              orderId: order._id,
              totalAmount: order.totalAmount,
              message: `Missed Order #${order._id} – ₹${order.totalAmount}`,
            };
            setNotifications((prev) => {
              const updated = [notif, ...prev];
              localStorage.setItem("notifications", JSON.stringify(updated));
              return updated;
            });
            toast.success(`Missed Order #${order._id} – ₹${order.totalAmount}`, {
              duration: 8000,
            });
          });
        }
      } catch (err) {
        console.error("Failed to fetch unseen orders", err);
      }
    };
    fetchUnseen();
  }, []);

  // ✅ Real-time new order socket
  useEffect(() => {
    socket.on("newOrder", (data) => {
      const notif = {
        id: data.orderId,
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        message: `New Order #${data.orderId} – ₹${data.totalAmount}`,
      };

      setNotifications((prev) => {
        const updated = [notif, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });

      toast((t) => (
        <div className="flex justify-between items-center gap-2">
          <span>{notif.message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-500 hover:text-gray-900 font-bold"
          >
            X
          </button>
        </div>
      ), { duration: 10000 });
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

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
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative top-1">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-4 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2 font-semibold border-b border-gray-200">Notifications</div>
                {notifications.length === 0 ? (
                  <p className="p-2 text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 text-sm border-b hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <p>{n.message}</p>
                        <p className="text-xs text-gray-400">
                          Order #{n.orderId} – ₹{n.totalAmount}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await markOrderAsSeen(n.orderId);
                          } catch (err) {
                            console.error("Failed to mark order as seen", err);
                          }
                          const updated = notifications.filter(
                            (x) => x.id !== n.id
                          );
                          setNotifications(updated);
                          localStorage.setItem(
                            "notifications",
                            JSON.stringify(updated)
                          );
                        }}
                        className="text-gray-400 hover:text-gray-600 font-bold"
                      >
                        X
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <Settings size={20} className="hidden md:block" />
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          {/* Trigger */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
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

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-50">
              <button
                title="Profile"
                className="w-full inline-flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
               <User/> Profile
              </button>
              <button
                onClick={handleLogout}  
                title="Logout"
                className="w-full inline-flex items-center gap-2 text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-100 cursor-pointer"
              >
               <LogOut/> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
