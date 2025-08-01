import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authAPI";
import toast from "react-hot-toast";
import logo from "/logo.svg";
import image from "../assets/session-locked.jpg";
import avatar from "/user-avatar.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function LockScreen() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("authEmail") || "admin@example.com";
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const expiry = localStorage.getItem("authExpiry");
    const now = Date.now();
    if (!expiry || now > parseInt(expiry)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiry");
    }
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password });
      const { token, role } = res.data;

      if (role !== "admin") {
        toast.error("Access denied");
        return;
      }

      const expiryTime = Date.now() + 30 * 60 * 1000;
      localStorage.setItem("authToken", token);
      localStorage.setItem("authExpiry", expiryTime.toString());

      toast.success("Session unlocked");
      navigate("/");
    } catch (err) {
      toast.error("Incorrect password");
      console.error("Unlock failed", err);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen animate-fade-in">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden rounded-[20px] m-2">
        <img src={image} alt="session" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/48 flex flex-col justify-end p-10 text-white">
          <h2 className="text-3xl font-bold mb-2">Session Locked</h2>
          <p className="text-sm opacity-80">
            For your security, your session has been locked due to inactivity.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 transition-all duration-300">
        <div className="w-full max-w-sm text-center animate-slide-in">
          <img src={logo} alt="Logo" className="w-35 mx-auto mb-4 absolute top-[2%] left-[52%]" />
          <h1 className="text-4xl font-bold mb-2">Lock screen</h1>
          <p className="text-sm mb-5 text-gray-600">
            Enter your password to unlock the screen
          </p>

          <img
            src={avatar}
            alt="user"
            className="w-18 h-18  rounded-full mx-auto mb-2 shadow-md"
          />
          <p className="text-lg font-semibold">Luna</p>
          <p className="text-sm text-gray-500 mb-6">Admin</p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm pr-10"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-sm text-white font-semibold text-sm transition-all duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Unlocking..." : "Unlock"}
            </button>
          </form>

          <p className="text-sm mt-6 text-gray-500">
            Not you?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
