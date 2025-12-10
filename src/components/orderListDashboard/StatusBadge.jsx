import { useEffect, useState } from "react";

export default function StatusBadge({ status: initialStatus, orderId }) {
  const [status, setStatus] = useState(initialStatus);

  const color =
    status === "success"
      ? "bg-green-100 text-green-700"
      : status === "failure"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  return (
    <span
    key={orderId}
      className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${color}`}
    >
      {status}
    </span>
  );
}
