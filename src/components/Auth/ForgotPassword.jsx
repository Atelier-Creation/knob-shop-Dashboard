import { useState } from "react";
import { forgotPassword } from "../../api/authAPI";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
// import logo from "/logo.svg";

export default function ForgotPassword({ onNext, onBack }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    localStorage.getItem('authEmail') && setEmail(localStorage.getItem('authEmail'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      console.log(res);      
      toast.success("OTP sent to your email");
      onNext(email);
    } catch (err) {
      console.log("User not found", err);
      toast.error("User not found");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md py-6 bg-white rounded-xl animate-fade-in">
        <div className="text-center">
          {/* <img src={logo} alt="Logo" className="w-16 mx-auto mb-4" /> */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <button
            type="submit"
            onClick={handleSubmit()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xs transition-all duration-200"
          >
            Send OTP
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 flex items-center justify-center text-sm text-gray-500 hover:text-blue-500 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
        </button>
      </div>
    </div>
  );
}