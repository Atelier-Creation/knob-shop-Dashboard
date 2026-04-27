import { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { deleteProduct } from "../api/productApi";
import toast from "react-hot-toast";

export function ProductCard({ product, onClick }) {
  const deleteClicked = useRef(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const fronenturl = import.meta.env.VITE_FRONTEND_URL;

  const actualPrice =
    product.price || product.variant?.[0]?.sizes?.[0]?.sellingPrice;
  const comparePrice =
    product.compare_price || product.variant?.[0]?.sizes?.[0]?.mrp;

  const calculatedPercentage =
    comparePrice && actualPrice
      ? Math.round(((comparePrice - actualPrice) / comparePrice) * 100)
      : 0;

  const isGain = calculatedPercentage > 0;

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

  const handleMenuAction = async (type) => {
    if (type === "delete") {
      if (deleteClicked.current) return; // prevent rapid double clicks
      deleteClicked.current = true;
      setTimeout(() => (deleteClicked.current = false), 1000);

      try {
        const confirmed = window.confirm(
          `Are you sure you want to delete "${product.name}"?`
        );
        if (!confirmed) return;

        await deleteProduct(product._id);
        toast.success("Product deleted successfully");
        onClick(product, type);
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete product");
      }
    } else if (type === "preview") {
      if (product._id) {
        const productUrl = `${fronenturl}/product/${product._id}`;
        window.open(productUrl, "_blank");
      } else {
        toast.error("Product ID not available for preview.");
      }
    } else {
      onClick(product, type);
    }
    setShowMenu(false);
  };

  const imageUrl = product.variant?.[0]?.images?.[0]?.url;
  console.log("Image URL:", imageUrl);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl w-full min-h-[290px] shadow-sm hover:shadow-md transition-all duration-200">
      {/* Comparison Indicator */}
      <div className="absolute top-3 left-4 flex flex-col items-start text-[10px] font-medium">
        <span
          className={`flex items-center gap-1 ${
            isGain ? "text-green-300" : "text-red-600"
          }`}
        >
          {isGain ? "↑" : "↓"} {Math.abs(calculatedPercentage)}%
        </span>
        <span className="text-[8px] text-gray-100">
          Compare to
          <br />
          Last Price
        </span>
      </div>

      {/* Dropdown Menu */}
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
              className="w-full flex items-center px-3 py-2 gap-2 hover:bg-gray-100"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => handleMenuAction("delete")}
              className="w-full flex items-center px-3 py-2 gap-2 hover:bg-red-100 hover:text-red-800"
            >
              <Trash2 size={14} /> Delete
            </button>
            <button
              onClick={() => handleMenuAction("preview")}
              className="w-full flex items-center px-3 py-2 gap-2 hover:bg-gray-100"
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        )}
      </div>
      {console.log(product)}
      {/* Product Image */}
      <div className="mb-4 p-1 flex justify-center rounded-sm">
        <img
          src={product?.variant?.[0].images?.[0]?.url || "/no-image.png"}
          alt={product.name}
          className="h-[160px] w-full object-contain rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4 px-2 text-left">
        <h4 className="font-medium text-[13px] text-gray-800 leading-snug truncate">
          {product.name}
        </h4>
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-[11px] text-black font-bold">
            MRP{" "}
            <span className="line-through font-semibold text-red-500">
              ₹{comparePrice?.toLocaleString() || "-"}
            </span>
          </p>
          <p className="text-[13px] text-black font-semibold">
            Offer Price{" "}
            <span className="text-green-600">
              ₹{actualPrice?.toLocaleString() || "-"}
            </span>
          </p>
        </div>
        <div className="mt-1 text-[11px] text-gray-500 flex justify-center gap-2">
          <span>
            Stock {product.stock || product.variant?.[0]?.sizes?.[0]?.stock}
          </span>
          <span className="text-gray-400">|</span>
          <span>Sold {product.sold || 0}</span>
        </div>
      </div>
    </div>
  );
}
