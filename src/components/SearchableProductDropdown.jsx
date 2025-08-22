import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SearchableProductDropdown = ({
  products,
  selectedProductId,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedProduct = products.find(
    (p) => p._id === selectedProductId
  );

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product) => {
    onSelectProduct(product._id);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedProduct ? selectedProduct.name : "-- Select a product --"}
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
              filteredProducts.map((p) => (
                <li
                  key={p._id}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(p)}
                >
                  {p.name}
                </li>
              ))
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