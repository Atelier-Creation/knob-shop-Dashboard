import { useState } from "react";
import { login } from "../../api/authAPI";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [step, setStep] = useState("login"); 
  const [email, setEmail] = useState("");
   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (step === "forgot")
    return (
      <ForgotPassword
        onNext={(email) => {
          setEmail(email);
          setStep("reset");
        }}
        onBack={() => setStep("login")}
      />
    );
  if (step === "reset")
    return <ResetPassword email={email} onBack={() => setStep("login")} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;
 setLoading(true);
    try {
      const res = await login({
        email: email.value,
        password: password.value,
      });

      console.log("Login response:", res.data);

      const { token, role } = res.data;

      if (role !== "admin") {
        toast.error("Access denied: Admins only");
        return;
      }

      localStorage.setItem("authToken", token);
      console.log("authToken", token);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Invalid email or password");
    }finally {
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-10">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.target.form.requestSubmit();
          }
        }}
        className="w-full border border-gray-300 p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-500 cursor-progress animate-pulse" : "bg-gray-800 hover:bg-gray-900"
        }`}
      >
        {loading ? "Logging in..." : "Login"} 
      </button>
      <div className="text-sm text-center">
        <button
          type="button"
          onClick={() => setStep("forgot")}
          className="text-gray-600 cursor-pointer hover:text-gray-800 font-medium"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}
