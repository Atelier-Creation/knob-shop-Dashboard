import { useState } from "react";
import { updateOrderByOrderId } from "../../api/orderListApi";


export default function StatusBadge({ status: initialStatus, orderId }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const color =
    status === "success"
      ? "bg-green-100 text-green-700"
      : status === "failure"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

      const handleStatusChange = async () => {
        const newStatus =
          status === "success"
            ? "pending"
            : status === "pending"
            ? "failure"
            : "success";
      
        setStatus(newStatus);
        setLoading(true);
      
        try {
          const updated = await updateOrderByOrderId(orderId, { paymentStatus: newStatus });
          console.log("Payment status updated:", updated);
        } catch (err) {
          console.error("Error updating status:", err);
          setStatus(initialStatus);
        } finally {
          setLoading(false);
        }
      };
      

  return <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${color}`} >{status}      {loading ? (
    <i className="bi bi-arrow-repeat animate-spin"></i>
  ) : (
    <i className="bi bi-pencil-square"></i>
  )}</span>;
}