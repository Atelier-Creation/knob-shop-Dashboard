import React, { useState } from 'react';
import { Filter, Plus, MoreVertical, Edit, Trash, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

// Updated dummy data for the table
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
    image: "/lock2.png" // Relative path
  },
  {
    name: "YDM4109A RL",
    status: "Out of Stock",
    statusColor: "bg-yellow-500", // Changed from yellow to red for "Out of Stock" for better visual cue
    stock: 150,
    sold: 130,
    offerPrice: "₹ 55,699",
    lastSold: "2 days ago",
    ctr: "1%",
    image: "/lock3.png" // Relative path
  },
  {
    name: "Luna Pro",
    status: "Inactive",
    statusColor: "bg-red-500", // Changed from red to gray for "Inactive" for better visual cue
    stock: 19,
    sold: 110,
    offerPrice: "₹ 97,199",
    lastSold: "2 days ago",
    ctr: "8.2%",
    image: "/lock2.png" // Relative path
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
    image: "/lock3.png" // Relative path
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
    image: "/lock1.png" // Relative path
  }
];

export default function ProductStatusTable() {
  const [openIndex, setOpenIndex] = useState(null);

  // Toggles the dropdown menu for action buttons
  const toggleDropdown = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    // Main container with responsive padding
    // p-4 for mobile, md:p-6 for medium and larger screens
    <div className="p-4 md:p-6 font-inter text-[#1c1c1c]">
      {/* ---------- TOOLBAR ---------- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 w-sm md:w-full">
        {/* Page Title */}
        {/* Centered on mobile, left-aligned on medium and larger screens */}
        <h1 className="text-[15px] font-semibold text-center md:text-left">
          Categories &amp; Products{" "}
          <span className="font-normal">/ Product Status</span>
        </h1>

        {/* Action Buttons and Select */}
        {/* Stacks vertically on small screens, becomes row on medium and larger */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
          {/* Filter Button */}
          <button className="flex items-center justify-center border border-gray-300 px-3 py-1.5 rounded text-sm w-full sm:w-auto hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          {/* Create New Category Button */}
          <button className="flex items-center justify-center bg-black text-white px-4 py-1.5 rounded text-sm w-full sm:w-auto hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create New Category
          </button>
          {/* Time Period Select */}
          <select className="border border-gray-300 px-3 py-1.5 rounded text-sm w-full sm:w-auto focus:ring-blue-500 focus:border-blue-500">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Annually</option>
          </select>
        </div>
      </div>

      {/* ---------- TABLE (scrollable on smaller screens) ---------- */}
      {/* The overflow-x-auto class ensures horizontal scrolling on small screens if content exceeds viewport width */}
      <div className="w-full overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-[960px] w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-100 rounded-lg font-medium">
              <th className="py-3 ps-4 whitespace-nowrap rounded-tl-lg rounded-bl-lg">Product Name</th>
              <th className="py-3 whitespace-nowrap">Status</th>
              <th className="py-3">Stock</th>
              <th className="py-3">Sold</th>
              <th className="py-3 whitespace-nowrap">Offer Price</th>
              <th className="py-3 whitespace-nowrap">Last Sold</th>
              <th className="py-3">CTR</th>
              <th className="py-3 rounded-tr-lg rounded-br-lg">Action</th>
            </tr>
          </thead>

          <tbody>
            {productData.map((p, i) => (
              <tr key={i} className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">
                {/* Product Name and Image */}
                <td className="flex items-center gap-3 py-3 px-2 whitespace-nowrap rounded-tl-lg rounded-bl-lg">
                  <img
                    src={p.image}
                    alt={p.name}
                    // Added a fallback for image loading errors
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/E0E0E0/1C1C1C?text=N/A"; }}
                    className="w-10 h-10 rounded-md object-cover border border-gray-200"
                  />
                  {p.name}
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`text-white px-2.5 py-1 rounded-full text-xs font-medium ${p.statusColor}`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* Stock */}
                <td className="whitespace-nowrap">{p.stock}</td>
                {/* Sold */}
                <td className="whitespace-nowrap">
                  {p.sold}
                  {/* Conditional rendering for the arrow based on sold quantity, assuming higher is better */}
                  {p.sold > 100 && ( // Example condition
                    <span className="text-green-600 text-xs font-medium ml-1">
                      ↑
                    </span>
                  )}
                </td>

                {/* Offer Price */}
                <td className="whitespace-nowrap">{p.offerPrice}</td>
                {/* Last Sold */}
                <td className="whitespace-nowrap">{p.lastSold}</td>
                {/* CTR */}
                <td className="whitespace-nowrap">{p.ctr}</td>

                {/* Action Dropdown */}
                <td className="relative rounded-tr-lg rounded-br-lg">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    onClick={() => toggleDropdown(i)}
                    aria-expanded={openIndex === i}
                    aria-haspopup="true"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {openIndex === i && (
                    <div className="absolute right-0 top-full mt-2 z-10 bg-white border border-gray-200 rounded-md shadow-lg w-32 origin-top-right animate-fade-in">
                      <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 w-full text-left rounded-t-md">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 w-full text-left">
                        <Trash size={14} /> Delete
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 w-full text-left rounded-b-md">
                        <Eye size={14} /> Preview
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION ---------- */}
      {/* Centered on mobile, right-aligned on medium and larger screens */}
      <div className="flex justify-center md:justify-end items-center mt-6 gap-4">
        <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-700">1/25</span>
        <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
