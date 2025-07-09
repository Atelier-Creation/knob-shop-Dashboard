import { useState } from "react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  Eye,
  Filter,
  Plus
} from "lucide-react";

const productData = [
  {
    name: "YDME100Nx:T",
    status: "Active",
    statusColor: "bg-green-500",
    stock: 200,
    sold: 100,
    offerPrice: "₹ 89,299",
    lastSold: "1 day ago",
    ctr: "5.2%",
    image: "/lock2.png"
  },
  {
    name: "YDM4109A RL",
    status: "Out of Stock",
    statusColor: "bg-yellow-500",
    stock: 150,
    sold: 130,
    offerPrice: "₹ 55,699",
    lastSold: "2 days ago",
    ctr: "1%",
    image: "/lock3.png"
  },
  {
    name: "Luna Pro",
    status: "Inactive",
    statusColor: "bg-red-500",
    stock: 19,
    sold: 110,
    offerPrice: "₹ 97,199",
    lastSold: "2 days ago",
    ctr: "8.2%",
    image: "/lock2.png"
  },
  {
    name: "YDM7116A-YH",
    status: "Pending Review",
    statusColor: "bg-orange-400",
    stock: 233,
    sold: 211,
    offerPrice: "₹ 75,199",
    lastSold: "3 days ago",
    ctr: "1.2%",
    image: "/lock3.png"
  },
  {
    name: "YDM 4115A",
    status: "Active",
    statusColor: "bg-green-500",
    stock: 150,
    sold: 130,
    offerPrice: "₹ 44,999",
    lastSold: "4 days ago",
    ctr: "3.2%",
    image: "/lock1.png"
  }
];

export default function ProductStatusTable() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="p-6 font-inter text-[#1c1c1c]">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[15px] font-semibold">
          Categories & Products <span className="font-normal">/ Product Status</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center border px-3 py-1.5 rounded text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center bg-black text-white px-4 py-1.5 rounded text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Create New Category
          </button>
          <select className="border px-3 py-1.5 rounded text-sm">
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-gray-500 bg-gray-100 rounded-lg font-medium">
            <th className="py-3 ps-4">Product Name</th>
            <th className="py-3">Status</th>
            <th className="py-3">Stock</th>
            <th className="py-3">Sold</th>
            <th className="py-3">Offer Price</th>
            <th className="py-3">Last Sold</th>
            <th className="py-3">CTR</th>
            <th className="py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((p, i) => (
            <tr key={i} className="bg-white shadow-sm rounded">
              <td className="flex items-center gap-3 py-3 px-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-10 h-10 rounded object-cover border"
                />
                {p.name}
              </td>
              <td>
                <span
                  className={`text-white px-2 py-1 rounded text-xs font-medium ${p.statusColor}`}
                >
                  {p.status}
                </span>
              </td>
              <td>{p.stock}</td>
              <td>
                {p.sold}{" "}
                <span className="text-green-600 text-xs font-medium ml-1">
                  ↑
                </span>
              </td>
              <td>{p.offerPrice}</td>
              <td>{p.lastSold}</td>
              <td>{p.ctr}</td>
              <td className="relative">
                <button
                  className="p-1 cursor-pointer"
                  onClick={() => toggleDropdown(i)}
                >
                  <MoreVertical size={16} />
                </button>
                {openIndex === i && (
                  <div className="absolute right-0 z-10 bg-white border border-[#C7C7C7] rounded shadow w-28 mt-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 w-full">
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-red-100 w-full">
                      <Trash size={14} />
                      Delete
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 w-full">
                      <Eye size={14} />
                      Preview
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-4">
        <button className="border p-1 rounded">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm">1/25</span>
        <button className="border p-1 rounded">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
