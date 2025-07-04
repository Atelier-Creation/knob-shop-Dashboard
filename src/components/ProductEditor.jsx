import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ColorSelector from "./ColorSelector";
import FeatureInput from "./FeatureInput";

export default function ProductEditor({ product, onUpdate, onClose }) {
  const [form, setForm] = useState({ ...product });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    onUpdate(form);
    onClose();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#FAFDFD] rounded-xl">
      {/* ───────────────── Header ───────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Products</h1>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          See Full View <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* ───────────────── Tabs ───────────────── */}
      <div className="mt-6 flex gap-4 text-sm font-medium">
        {/* active */}
        <span className="rounded-full bg-orange-100 px-4 py-1 shadow-inner">
          Descriptions
        </span>
        <button className="rounded-full text-gray-500 hover:text-gray-900">
          Inventory
        </button>
        <button className="rounded-full text-gray-500 hover:text-gray-900">
          Pricing
        </button>
        <button className="rounded-full text-gray-500 hover:text-gray-900">
          Images
        </button>
      </div>

      {/* ───────────────── Image Preview ───────────────── */}
      <div className="mt-6 flex items-center justify-center h-80 border border-gray-200 rounded-xl">
        {form.image ? (
          <img
            src={form.image}
            alt={form.name}
            className="h-64 object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* ───────────────── Form Fields ───────────────── */}
      <div className="mt-6 space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-medium mb-1">
            Product Name
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Product Name"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs font-medium mb-1">Brand</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
            value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder="Brand"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium mb-1">Category</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Category"
          />
        </div>

        {/* Price & Stock */}
        <div>
          <span className="block text-xs font-medium mb-2">
            Price & Stock
          </span>
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Enter Price
              </label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="₹ 0.00"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Discount
              </label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
                value={form.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                placeholder="0 %"
              />
            </div>
          </div>
        </div>

        {/* Colors & Features */}
        <ColorSelector
          selectedColors={form.colors}
          onChange={(colors) => handleChange("colors", colors)}
        />

        <FeatureInput
          features={form.features}
          onChange={(features) => handleChange("features", features)}
        />
      </div>

      {/* ───────────────── Action Buttons ───────────────── */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex-1 rounded-md border border-gray-300 py-3 text-sm font-medium hover:bg-gray-100 cursor-pointer transition"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-md bg-black py-3 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer transition"
        >
          Update Products
        </button>
      </div>
    </div>
  );
}
