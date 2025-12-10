import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { getAllProducts } from "../api/productApi";

const SearchableProductDropdown = ({
  selectedProductId,
  selectedProductIds = [],
  onSelectProduct,
  multiple = false,
}) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  const fetchProducts = async (query = "") => {
    try {
      setLoading(true);
      const data = await getAllProducts({
        page: 1,
        limit: 50,
        searchQuery: query,
      });
      setProducts(data.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  // When dropdown opens — load products
  useEffect(() => {
    if (isOpen) fetchProducts("");
  }, [isOpen]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isOpen) fetchProducts(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, isOpen]);

  const handleSelect = (product) => {
    if (multiple) {
      const alreadySelected = selectedProductIds.includes(product._id);
      const updated = alreadySelected
        ? selectedProductIds.filter((id) => id !== product._id)
        : [...selectedProductIds, product._id];

      onSelectProduct(updated);
    } else {
      onSelectProduct(product._id);
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const selectedProduct = !multiple
    ? products.find((p) => p._id === selectedProductId)
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* MAIN BUTTON */}
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {!multiple
            ? selectedProduct?.name || "-- Select a product --"
            : selectedProductIds.length > 0
            ? `${selectedProductIds.length} product(s) selected`
            : "-- Select products --"}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* DROPDOWN LIST */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* SEARCH FIELD */}
          <div className="p-2 sticky top-0 bg-white border-b border-gray-300">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 border border-gray-400 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul>
            {loading && (
              <li className="px-4 py-2 text-sm text-gray-500">{searchTerm ? `Searching for ${searchTerm}` : "Loading..."}</li>
            )}

            {!loading && products.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">
                No products found.
              </li>
            )}

            {!loading &&
              products.map((p) => {
                const isSelected = multiple
                  ? selectedProductIds.includes(p._id)
                  : selectedProductId === p._id;

                return (
                  <li
                    key={p._id}
                    onClick={() => handleSelect(p)}
                    className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center gap-3 hover:bg-gray-100 ${
                      isSelected ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {/* IMAGE + NAME */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border p-1 bg-white border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src={p.images?.[0] || "/fallback.png"}
                          alt={p.name}
                          className="h-12 w-12 object-contain"
                        />
                      </div>

                      <span className="truncate max-w-[360px]" title={p.name}>{p.name}</span>
                    </div>

                    {/* CHECK MARK */}
                    {isSelected && (
                      <Check
                        size={14}
                        className="text-green-600 flex-shrink-0"
                      />
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableProductDropdown;
