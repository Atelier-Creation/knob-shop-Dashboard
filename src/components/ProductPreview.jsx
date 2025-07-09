import { Bookmark, Eye, X } from "lucide-react";

export default function ProductPreview({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center mb-30 bg-opacity-40 border border-l-gray-300 shadow">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl max-h-[95vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black bg-white p-1 border border-gray-200 rounded-full shadow-sm"
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div className="border border-gray-200 rounded-xl h-80 mb-6 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-64 object-contain"
            />
          ) : (
            <span className="text-sm text-gray-400">No Image Available</span>
          )}
        </div>

        {/* Product Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {product.name}
        </h2>

        {/* Product Info */}
        <div className="text-sm space-y-1 text-gray-700">
          <p>
            <span className="text-gray-500 font-medium">Brand:</span>{" "}
            <strong>{product.brand}</strong>
          </p>
          <p>
            <span className="text-gray-500 font-medium">Category:</span>{" "}
           <strong> {product.category}</strong>
          </p>
          <p>
            <span className="text-gray-500 font-medium">Product ID:</span>{" "}
            <strong>#{product.id}</strong>
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-4 text-sm space-y-1 flex justify-between">
          <p className="flex flex-col gap-2">
            <span className="text-gray-500 font-medium">MRP:</span>{" "}
            <s className="text-red-500">₹ {product.mrp}</s>
          </p>
          <p className="flex flex-col gap-2">
            <span className="text-gray-500 font-medium">Offer Price:</span>{" "}
            <span className="text-green-600 font-medium">
              ₹ {product.offerPrice}
            </span>
          </p>
          <p className="flex flex-col gap-2">
            <span className="text-gray-500 font-medium">Stock Quantity:</span>{" "}
            {product.stock}
          </p>
        </div>

        {/* Color Variants */}
        {product.colors?.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Color Variants
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {product.features?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Features</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
            
         <button className="flex-1 text-sm bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"  onClick={onClose}>
          <Bookmark className="inline text-sm text-gray-200" size={18}/> Edit Product
          </button>

          <button
            onClick={onClose}
            className="flex-1 text-sm border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
          >
            <Eye className="inline text-sm text-gray-600" size={18}/> Sell a  ful view
          </button>
        </div>
      </div>
    </div>
  );
}
