import { FileText } from "lucide-react";

const orders = [
  {
    id: "1209-9092",
    productName: "YDM4109 A",
    quantity: "1 Pcs",
    price: "₹ 89,299",
    status: "Success",
    statusColor: "bg-green-500",
    image: "/lock1.png",
  },
  {
    id: "1209-9092",
    productName: "YSME100NxT",
    quantity: "1 Pcs",
    price: "₹ 55,699",
    status: "Pending",
    statusColor: "bg-yellow-400",
    image: "/lock3.png",
  },
  {
    id: "1209-9092",
    productName: "Luna Pro",
    quantity: "1 Pcs",
    price: "₹ 97,199",
    status: "Received",
    statusColor: "bg-red-500",
    image: "/lock2.png",
  },
  {
    id: "1209-9092",
    productName: "YDM 4115A",
    quantity: "1 Pcs",
    price: "₹ 87,199",
    status: "Received",
    statusColor: "bg-red-500",
    image: "/lock1.png",
  },
  {
    id: "1209-9092",
    productName: "YDM4109A RL",
    quantity: "1 Pcs",
    price: "₹ 44,999",
    status: "Received",
    statusColor: "bg-red-500",
    image: "lock3.png",
  },
];

export default function CurrentOrdersStatus() {
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

      {/* Table Header */}
      <div className="grid grid-cols-4 items-center bg-[#F6F6F6] p-3 rounded-t-xl text-xs text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="accent-purple-500" />
          <span>Id Transaction</span>
        </div>
        <div className="text-center">Products</div>
        <div className="text-right">Status</div>
        <div className="text-right">Amount</div>
      </div>

      {/* Order Rows */}
      <div className="divide-y">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center px-3 py-4 text-sm"
          >
            {/* ID & Checkbox */}
            <div className="flex items-center gap-2 text-gray-700 text-xs">
              <input type="checkbox" className="accent-purple-500" />
              {order.id}
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-3 col-span-2 ms-2">
                {/* fixed 48 px × 48 px square */}
                <div className="w-12 h-12 shrink-0 overflow-hidden rounded bg-gray-200 flex items-center justify-center">
                    <img
                    src={order.image}
                    alt={order.productName}
                    className="w-full h-full object-cover"   // fills the square
                    />
                </div>

                {/* product meta */}
                <div>
                    <p className="font-semibold text-sm text-gray-800">{order.productName}</p>
                    <p className="text-[11px] text-gray-500">{order.quantity}</p>
                </div>
                </div>


            {/* Status Pill */}
            <div className="text-center">
              <span
                className={`text-white text-xs px-3 py-1 rounded-full ${order.statusColor}`}
              >
                {order.status}
              </span>
            </div>

            {/* Amount */}
            <div className="text-right font-medium text-gray-900">
              {order.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
