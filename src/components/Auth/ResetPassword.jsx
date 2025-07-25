// src/components/Auth/ResetPassword.jsx
import { useState } from "react";
import { resetPassword } from "../../api/authAPI";
import toast from "react-hot-toast";

export default function ResetPassword({ email, onBack }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">Reset Password</h2>
      <input
        type="text"
        placeholder="OTP"
        required
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="New Password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Reset Password
      </button>
      <button type="button" onClick={onBack} className="text-gray-500 text-sm">
        ← Back to login
      </button>
    </form>
  );
}
