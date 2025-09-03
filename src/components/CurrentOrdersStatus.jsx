import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getLatestAnalyticsSnapshot } from "../api/analyticsApi";

export default function CurrentOrdersStatus() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getLatestAnalyticsSnapshot("Weekly");
        // Attach statusColor dynamically based on logic (you can improve this)
        const statusMapping = ["success", "pending", "received", "cancelled"];
        const statusColorMap = {
          success: "bg-green-500",
          pending: "bg-yellow-400",
          received: "bg-red-500",
          cancelled: "bg-gray-500",
        };

        const formattedProducts = data.topSellingProducts.map((prod, i) => ({
          id: `TXN-${1000 + i}`,
          productName: prod.name,
          quantity: `${prod.soldQty} Pcs`,
          price: `₹ ${prod.revenue.toLocaleString()}`,
          status: statusMapping[i % statusMapping.length], // Simulate different status
          statusColor: statusColorMap[statusMapping[i % statusMapping.length]],
          image: prod.image, // Replace with actual product image if available
        }));

        setTopProducts(formattedProducts);
        setOrderStatus(data.orderStatusSummary);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const SkeletonRow = () => (
    <div className="px-3 py-4 md:grid md:grid-cols-4 md:items-center flex flex-col gap-3 animate-pulse">
      {/* ID */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>

      {/* Product Info */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="w-28 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Status */}
      <div>
        <div className="w-16 h-5 bg-gray-300 rounded-full" />
      </div>

      {/* Price */}
      <div className="w-16 h-4 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] w-full shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#F1E7FF] p-2 rounded-full">
            <FileText size={16} className="text-[#B374FF]" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">
            Current Orders Status
          </h2>
        </div>
        <a href="#" className="text-xs text-gray-500 underline">
          View More
        </a>
      </div>

      {/* Table Header (desktop only) */}
      <div className="hidden md:grid grid-cols-4 items-center bg-[#F6F6F6] p-3 rounded-t-xl text-xs text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-purple-500 hidden md:block"
          />
          <span>Id Transaction</span>
        </div>
        <div className="text-center">Products</div>
        <div className="text-right">Status</div>
        <div className="text-right">Amount</div>
      </div>

      {/* Order Rows */}
      <div className="divide-y">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          : topProducts.map((order, index) => (
              <div
                key={index}
                className="px-3 py-4 md:grid md:grid-cols-4 md:items-center flex flex-col gap-3 text-sm"
              >
                {/* ID & Checkbox */}
                <div className="flex items-center gap-2 text-gray-700 text-xs">
                  <input
                    type="checkbox"
                    className="accent-purple-500 hidden md:block"
                  />
                  <span className="md:hidden font-medium text-gray-500">
                    Transaction ID:
                  </span>
                  {order.id}
                </div>

                {/* Product Info */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 shrink-0 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={order.image || null}
                      alt={order.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {order.productName?.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {order.quantity}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="text-left md:text-right">
                  <span className="md:hidden font-medium text-gray-500 mr-1">
                    Status:
                  </span>
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Price */}
                <div className="text-left md:text-right font-medium text-gray-900">
                  <span className="md:hidden font-medium text-gray-500 mr-1">
                    Amount:
                  </span>
                  {order.price}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
