import React, { useEffect, useState } from "react";
import {
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { getAllProducts } from "../api/productApi";

// Updated dummy data for the table
// const productData = [
//   {
//     name: "YDME100Nx:T",
//     status: "Active",
//     statusColor: "bg-green-500",
//     stock: 200,
//     sold: 100,
//     offerPrice: "₹ 89,299",
//     lastSold: "1 day ago",
//     ctr: "5.2%",
//     image: "/lock2.png" // Relative path
//   },
//   {
//     name: "YDM4109A RL",
//     status: "Out of Stock",
//     statusColor: "bg-yellow-500", // Changed from yellow to red for "Out of Stock" for better visual cue
//     stock: 150,
//     sold: 130,
//     offerPrice: "₹ 55,699",
//     lastSold: "2 days ago",
//     ctr: "1%",
//     image: "/lock3.png" // Relative path
//   },
//   {
//     name: "Luna Pro",
//     status: "Inactive",
//     statusColor: "bg-red-500", // Changed from red to gray for "Inactive" for better visual cue
//     stock: 19,
//     sold: 110,
//     offerPrice: "₹ 97,199",
//     lastSold: "2 days ago",
//     ctr: "8.2%",
//     image: "/lock2.png" // Relative path
//   },
//   {
//     name: "YDM7116A-YH",
//     status: "Pending Review",
//     statusColor: "bg-orange-400",
//     stock: 233,
//     sold: 211,
//     offerPrice: "₹ 75,199",
//     lastSold: "3 days ago",
//     ctr: "1.2%",
//     image: "/lock3.png" // Relative path
//   },
//   {
//     name: "YDM 4115A",
//     status: "Active",
//     statusColor: "bg-green-500",
//     stock: 150,
//     sold: 130,
//     offerPrice: "₹ 44,999",
//     lastSold: "4 days ago",
//     ctr: "3.2%",
//     image: "/lock1.png" // Relative path
//   }
// ];

// Helper function to format number with commas
const formatPrice = (price) => {
  return `₹ ${new Intl.NumberFormat('en-IN').format(price)}`;
};

// Helper function to safely parse a price string into a number
const parsePrice = (priceStr) => {
  if (typeof priceStr !== "string") return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
};

export default function ProductStatusTable() {
  const [openIndex, setOpenIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // New state for search, filter, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Constants for pagination
  const productsPerPage = 5;

  // State to hold the products after filtering, but before pagination
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products on initial load
  useEffect(() => {
    setLoadingProducts(true);
    getAllProducts()
      .then((data) => {
        // Map data to the desired format with numeric price
        const mappedProducts = data.map((p) => {
          const firstVariant = p.variant?.[0] || {};
          const firstSize = firstVariant.sizes?.[0] || {};

          return {
            ...p, // Keep original product ID etc.
            name: p.name,
            image:
              p.images?.[0] ||
              "https://placehold.co/40x40/E0E0E0/1C1C1C?text=N/A",
            status: p.status === "active" ? "Active" : "Inactive",
            statusColor:
              p.status === "active"
                ? "bg-green-500"
                : p.status === "out of stock"
                ? "bg-red-500"
                : p.status === "pending review"
                ? "bg-orange-400"
                : "bg-gray-500",
            stock: firstSize.stock ?? 0,
            sold: Math.floor(Math.random() * 200), // Dummy, unless your API provides sold count
            offerPrice: firstSize.sellingPrice ?? 0, // Store as number
            lastSold: "N/A", // Replace with actual field if your API has it
            ctr: `${Math.floor(Math.random() * 10)}%`, // Dummy CTR for now
          };
        });
        setProducts(mappedProducts);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Effect to handle filtering and searching
  useEffect(() => {
    let result = [...products];

    // 1. Filter by search term
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min) && min >= 0) {
      result = result.filter((p) => p.offerPrice >= min);
    }
    if (!isNaN(max) && max >= 0) {
      result = result.filter((p) => p.offerPrice <= max);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on new filter/search
  }, [products, searchTerm, minPrice, maxPrice]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Event handlers
  const toggleDropdown = (i) => setOpenIndex(openIndex === i ? null : i);
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const trimName = (name, wordLimit = 3) => {
    if (!name) return "";
    const words = name.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : name;
  };

  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="text-[#1c1c1c] font-sans p-4">
      {/* ---------- TOOLBAR ---------- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 w-sm md:w-full">
        {/* Page Title */}
        <h1 className="text-[15px] font-semibold text-center md:text-left">
          Categories &amp; Products{" "}
          <span className="font-normal">/ Product Status</span>
        </h1>
      </div>

      {/* ---------- SEARCH AND FILTER INPUTS ---------- */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price Filter Inputs */}
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <span className="text-sm text-gray-500">Price:</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* ---------- TABLE (scrollable on smaller screens) ---------- */}
      <div className="w-full overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-[960px] w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-100 rounded-lg font-medium">
              <th className="py-3 ps-4 whitespace-nowrap rounded-tl-lg rounded-bl-lg">
                Product Name
              </th>
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
            {currentProducts.length > 0 ? (
              currentProducts.map((p, i) => (
                <tr
                  key={p.id}
                  className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Name and Image */}
                  <td className="flex items-center gap-3 py-3 px-2 whitespace-nowrap max-w-20 rounded-tl-lg rounded-bl-lg">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/40x40/E0E0E0/1C1C1C?text=N/A";
                      }}
                      className="w-10 h-10 rounded-md object-contain p-1 border border-gray-200"
                    />
                    <span title={p.name}>{trimName(p.name)}</span>
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
                    {p.sold > 100 && (
                      <span className="text-green-600 text-xs font-medium ml-1">
                        ↑
                      </span>
                    )}
                  </td>

                  {/* Offer Price */}
                  <td className="whitespace-nowrap">
                    {formatPrice(p.offerPrice)}
                  </td>
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-10 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION ---------- */}
      <div className="flex justify-center md:justify-end items-center mt-6 gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
