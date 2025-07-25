import {
  MoreVertical,
  ChevronRight,
  Dot,
  XCircle,
  FileText,
  Archive,
  PackageX,
  AlertCircle,
  RotateCcw,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductStockCard({ product }) {
  const navigate = useNavigate();
  const getStockBarColor = (stock) => {
    if (stock === 0 || stock <= 20) return "bg-red-500";
    return "bg-green-500";
  };

  const getStockLabel = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 20) return `Stocks ${stock} – Low`;
    return `Stocks ${stock} – High`;
  };

  const getStockLabelColor = (stock) => {
    if (stock === 0 || stock <= 20) return "text-red-600";
    return "text-green-600";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="ml-1 inline-flex items-center text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            <CircleCheck className="w-4 h-4 mr-1" /> Active
          </span>
        );
      case "Inactive":
        return (
          <span className="ml-1 inline-flex items-center text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
            <XCircle className="w-4 h-4 mr-1" /> Inactive
          </span>
        );
      case "Draft":
        return (
          <span className="ml-1 inline-flex items-center text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            <FileText className="w-4 h-4 mr-1" /> Draft
          </span>
        );
      case "Archived":
        return (
          <span className="ml-1 inline-flex items-center text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
            <Archive className="w-4 h-4 mr-1" /> Archived
          </span>
        );
      case "Out of Stock":
        return (
          <span className="ml-1 inline-flex items-center text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
            <PackageX className="w-4 h-4 mr-1" /> Out of Stock
          </span>
        );
      case "Low":
        return (
          <span className="ml-1 inline-flex items-center text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
            <AlertCircle className="w-4 h-4 mr-1" /> Low Stock
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm w-full">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-24 object-contain"
          />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center justify-between">
              {product.name}
            </h2>
            <p className="text-xs text-gray-500 mt-3">
              SKU:{" "}
              <span className="text-gray-900 text-xs text-semibold">
                {product.sku}
              </span>
            </p>
            <div className="text-xs space-y-0.5 flex gap-4 mt-4">
              <p className="flex flex-col gap-0">
                <span className="text-gray-500 mb-2">Retail Range</span>₹{" "}
                {product.retail}
              </p>
              <p className="flex flex-col gap-0">
                <span className="text-gray-500 mb-2">Wholesale Range</span>₹{" "}
                {product.wholesale}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">{getStatusBadge(product.status)} <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" /></div>
        
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 space-y-1 text-xs">
          <div className="flex flex-col items-start gap-2">
            <span
              className={`${getStockLabelColor(product.stock)} font-medium`}
            >
              {getStockLabel(product.stock)}
            </span>
            {product.stock > 0 && (
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`${getStockBarColor(product.stock)} h-full`}
                  style={{
                    width: `${Math.min((product.stock / 250) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            )}
          </div>
          <div className="flex justify-between gap-1 text-gray-600">
            <span>Sold - {product.sold}</span>
            <div className="h-4 border-l-2 border-gray-300 mx-0"></div>
            <span>Variants({product.variants})</span>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2">
          {product.status === "Inactive" || product.stock === 0 ? (
            <button className="text-[10px] bg-black text-white ps-2 pe-3 py-1 rounded-md flex items-center gap-1 cursor-pointer">
              <RotateCcw className="text-white" size={12} /> Reorder
            </button>
          ) : (
            <div />
          )}
          <div className="bg-white rounded shadow p-1 cursor-pointer" title="View More" onClick={() => navigate(`/product-stock/${product.id}`)}>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
