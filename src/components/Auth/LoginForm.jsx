import { useState } from "react";
import { login } from "../../api/authAPI";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginForm() {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (step === "forgot") {
    return (
      <ForgotPassword
        onNext={(email) => {
          setEmail(email);
          setStep("reset");
        }}
        onBack={() => setStep("login")}
      />
    );
  }

  if (step === "reset") {
    return <ResetPassword email={email} onBack={() => setStep("login")} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;
    setLoading(true);
    try {
      const res = await login({
        email: email.value,
        password: password.value,
      });

      const data = res.data;
      const role = data.role;
      const token = data.token;
      
      if (role !== "admin") {
        toast.error("Access denied: Admins only");
        return;
      }

      const expiryTime = Date.now() + 60 * 60 * 1000; // 30 mins

      localStorage.setItem("authEmail", data.role === "admin" ? data.email : email.value);
      localStorage.setItem("authToken", token);
      localStorage.setItem("authExpiry", expiryTime.toString());
      toast.success("Login successful");
      console.log("localStorage:", localStorage);
      
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-700">
      <div>
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <label className="block mb-1 font-medium" htmlFor="email">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="Your email address"
          required
          className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.form.requestSubmit();
              }
            }}
            className="w-full border border-gray-300 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 cursor-pointer select-none"
          >
            {showPassword ? (
              <EyeClosed size={17} className="text-gray-600" />
            ) : (
              <Eye size={17} className="text-gray-600" />
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-blue-500"
          />
          Remember Me
        </label>
        <button
          type="button"
          onClick={() => setStep("forgot")}
          className="text-blue-500 text-sm font-medium hover:underline"
        >
          Forget Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-sm text-white font-semibold transition-all duration-200 ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      {/* <p className="text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <a href="#" className="text-blue-500 font-medium hover:underline">
          Sign Up
        </a>
      </p> */}
    </form>
  );
}
