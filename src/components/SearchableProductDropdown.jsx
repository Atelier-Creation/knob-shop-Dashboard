import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const SearchableProductDropdown = ({
  products,
  selectedProductId,       // single select (string)
  selectedProductIds = [],  // multi select (array)
  onSelectProduct,
  multiple = false,         // default single select
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Single selected product (for display)
  const selectedProduct = !multiple
    ? products.find((p) => p._id === selectedProductId)
    : null;

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product) => {
    if (multiple) {
      // toggle select/unselect
      const alreadySelected = selectedProductIds.includes(product._id);
      let updated;
      if (alreadySelected) {
        updated = selectedProductIds.filter((id) => id !== product._id);
      } else {
        updated = [...selectedProductIds, product._id];
      }
      onSelectProduct(updated);
    } else {
      onSelectProduct(product._id);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {!multiple
            ? selectedProduct
              ? selectedProduct.name
              : "-- Select a product --"
            : selectedProductIds.length > 0
            ? `${selectedProductIds.length} product(s) selected`
            : "-- Select products --"}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full p-2 text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const isSelected = multiple
                  ? selectedProductIds.includes(p._id)
                  : selectedProductId === p._id;

                return (
                  <li
                    key={p._id}
                    className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
                      isSelected ? "bg-gray-100 font-medium" : ""
                    }`}
                    onClick={() => handleSelect(p)}
                  >
                    <span>{p.name}</span>
                    {isSelected && <Check size={14} className="text-green-600" />}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">
                No products found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableProductDropdown;
