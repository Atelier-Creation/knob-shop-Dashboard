export default function StatusBadge({ status }) {
  const color =
    status === "success"
      ? "bg-green-100 text-green-700"
      : status === "failure"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>;
}