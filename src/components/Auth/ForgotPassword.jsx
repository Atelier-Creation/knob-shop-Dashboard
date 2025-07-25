// src/components/Auth/ForgotPassword.jsx
import { useState } from "react";
import { forgotPassword } from "../../api/authAPI";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword({ onNext, onBack }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      toast.success("OTP sent to your email");
      onNext(email);
    } catch (err) {
      console.log("User not found",err);
        toast.error("User not found");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-10">
      <h2 className="text-xl font-bold text-center">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="w-full border border-gray-400 p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 cursor-pointer">
        Send OTP
      </button>
      <button type="button" onClick={onBack} className="text-gray-500 text-sm cursor-pointer">
        <ArrowLeft className="inline"/> Back to login
      </button>
    </form>
  );
}
