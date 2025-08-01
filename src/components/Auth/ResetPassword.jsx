import { useState } from "react";
import { resetPassword } from "../../api/authAPI";
import toast from "react-hot-toast";
// import logo from "/logo.svg";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function ResetPassword({ email, onBack }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => { 
    if (!email) {
      toast.error("Email is required to reset password");
      onBack();
    }
  }, [email, onBack]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ email, otp, newPassword });
      toast.success("Password reset successful");
      onBack();
    } catch {
      toast.error("Invalid or expired OTP");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md py-6 bg-white rounded-xl animate-fade-in">
        <div className="text-center">
          {/* <img src={logo} alt="Logo" className="w-16 mx-auto mb-4" /> */}
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Reset Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter the OTP sent to your email and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <input
            type="text"
            placeholder="OTP"
            required
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="password"
            placeholder="New Password"
             autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xs transition-all duration-200"
          >
            Reset Password
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