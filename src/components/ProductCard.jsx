import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

export function ProductCard({ product, onClick }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const isGain = product.comparedPercentage > 0;

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = (type) => {
    onClick(product, type);
    setShowMenu(false); // close menu after action
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl w-full min-h-[290px] p-2 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Comparison Indicator */}
      <div className="absolute top-3 left-4 flex flex-col items-start text-[10px] font-medium">
        <span className={`flex items-center gap-1 ${isGain ? 'text-green-600' : 'text-red-600'}`}>
          {isGain ? '↑' : '↓'} {Math.abs(product.comparedPercentage)}%
        </span>
        <span className="text-[8px] text-gray-400">
          Compare to<br />Last Week
        </span>
      </div>

      {/* Dropdown */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-1 w-[110px] bg-white border border-gray-200 rounded-md shadow z-10 text-sm">
            <button
              onClick={() => handleMenuAction("edit")}
              className="w-full flex items-center px-3 py-2 gap-2 cursor-pointer hover:bg-gray-100"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => handleMenuAction("delete")}
              className="w-full flex items-center px-3 py-2 gap-2 cursor-pointer hover:bg-red-100 hover:text-red-800"
            >
              <Trash2 size={14} /> Delete
            </button>
            <button
              onClick={() => handleMenuAction("preview")}
              className="w-full flex items-center px-3 py-2 gap-2 cursor-pointer hover:bg-gray-100"
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="mb-4 p-2 flex justify-center bg-gray-100 rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          className="h-[150px] object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="mt-4 text-left">
        <h4 className="font-medium text-[13px] text-gray-800 leading-snug truncate overflow-hidden whitespace-nowrap">{product.name}</h4>
        <div className="flex">
          <p className="text-[11px] text-black font-bold mt-1">
          MRP <span className="line-through font-semibold text-red-500">₹{product.mrp.toLocaleString()}</span>
        </p>
        <p className="text-[13px] text-black font-semibold">
          Offer price <span className='text-green-600'>₹{product.offerPrice.toLocaleString()}</span>
        </p>
        </div>
        <div className="mt-1 text-[11px] text-gray-500 flex justify-center gap-2">
          <span>Stock {product.stock}</span>
          <span className="text-gray-400">|</span>
          <span>Sold {product.sold}</span>
        </div>
      </div>
    </div>
  );
}
