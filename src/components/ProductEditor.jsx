import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ColorNamer from "color-namer";
import { fetchCategories } from "../api/categoryAPI";
import { updateProduct } from "../api/productApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductEditor({ product, onUpdate, onClose }) {
  console.log(product);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    image: "",
    category: "",
    price: 0,
    discount: 0,
    colors: [],
    features: [],
    ...product,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    loadCategories();
  }, []);

  const getSuggestedName = (hex) => {
    try {
      const names = ColorNamer(hex);
      return names?.ntc?.[0]?.name || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        brand: product.brand || "",
        image: product.variant?.[0].images?.[0].url || "",
        category: product.category?._id || "",
        price: product.variant?.[0].sizes?.[0]?.mrp || 0,
        discount: product.variant?.[0].sizes?.[0]?.discountPercentage,
        tax: product.variant?.[0].sizes?.[0]?.taxPercentage,
        sellingPrice: product.variant?.[0].sizes?.[0]?.sellingPrice,
        colors: Array.isArray(product.variant)
          ? product.variant.map((v) => ({
              hex: v.value,
              name: v.title || getSuggestedName(v.value), // fallback name
              images: Array.isArray(v.images) ? v.images : [],
              sizes: Array.isArray(v.sizes) ? v.sizes : [],
            }))
          : [],
      });
    }
  }, [product]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async () => {
    if (!product) return;

    const changedPayload = {};
    const updatedColors = [];

    form.colors.forEach((color, cIndex) => {
      const originalColor = product.variant?.[cIndex];
      const updatedColor = {
        ...originalColor,
        title: color.title,
        value: color.value,
        sizes: [],
        images: color.images,
      };

      let colorChanged = false;

      color.sizes.forEach((size, sIndex) => {
        const originalSize = originalColor?.sizes?.[sIndex] || {};

        const updatedSize = {
          ...originalSize,
          label: size.label,
          mrp: Number(size.mrp),
          discountPercentage: Number(size.discountPercentage),
          taxPercentage: Number(size.taxPercentage),
        };

        // Recalculate selling price
        const discounted =
          updatedSize.mrp -
          (updatedSize.mrp * updatedSize.discountPercentage) / 100;

        const withTax =
          discounted + (discounted * updatedSize.taxPercentage) / 100;

        updatedSize.sellingPrice = Math.round(withTax);

        updatedColor.sizes.push(updatedSize);
        colorChanged = true;
      });

      if (colorChanged) {
        updatedColors.push(updatedColor);
      }
    });

    if (updatedColors.length > 0) {
      changedPayload.variant = updatedColors;
    }

    if (Object.keys(changedPayload).length === 0) {
      toast("No changes made.");
      return;
    }

    try {
      await updateProduct(product._id, changedPayload);
      toast.success("Product updated!");
      onUpdate(product); // refresh list
      onClose?.(); // close modal
    } catch (error) {
      console.error(error);
      toast.error("Update failed.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#FAFDFD] rounded-xl">
      {/* ───────────────── Header ───────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Products</h1>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 cursor-pointer" onClick={() => navigate(`/products/${product._id}/edit`)}>
          Full View Edit <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* ───────────────── Tabs ───────────────── */}
      <div className="mt-6 flex gap-4 text-sm font-medium">
        <span className="rounded-full bg-orange-100 px-4 py-1 shadow-inner cursor-not-allowed">
          Sort Edit
        </span>
      </div>

      {/* ───────────────── Image Preview ───────────────── */}
      <div className="mt-6 flex items-center justify-center bg-white h-80 border border-gray-200 rounded-xl">
        {form.image ? (
          <img
            src={form.image}
            alt={form.name || "Product Image"}
            className="h-full w-full object-cover  rounded-xl"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* ───────────────── Form Fields ───────────────── */}
      <div className="mt-6 space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-medium mb-1">Product Name</label>
          <input
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
            value={form.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Product Name"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs font-medium mb-1">Brand</label>
          <input
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
            value={form.brand || ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder="Brand"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium mb-1">Category</label>
          <select
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none"
            value={
              typeof form.category === "object"
                ? form.category?._id
                : form.category
            }
            onChange={(e) => {
              const selected = categories.find(
                (cat) => cat._id === e.target.value
              );
              handleChange("category", selected || "");
            }}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-medium mb-2">
            Select Color Variant
          </label>
          <div className="flex gap-2 flex-wrap">
            {form.colors?.map((color, index) => (
              <button
                key={index}
                className={`w-6 h-6 rounded-full cursor-pointer border-2 border-gray-400 ${
                  selectedColorIndex === index
                    ? "border-black"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => {
                  setSelectedColorIndex(index);
                  setSelectedSizeIndex(0); // reset size when color changes
                }}
              />
            ))}
          </div>
        </div>

        {form.colors?.[selectedColorIndex]?.sizes?.length > 0 && (
          <div className="mt-4">
            <label className="block text-xs font-medium mb-2">
              Select Size Variant
            </label>
            <div className="flex gap-2 flex-wrap">
              {form.colors[selectedColorIndex].sizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-full border cursor-pointer ${
                    selectedSizeIndex === index
                      ? "bg-black text-white"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setSelectedSizeIndex(index)}
                >
                  {size.label || `Size ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {form.colors?.[selectedColorIndex]?.sizes?.[selectedSizeIndex] && (
          <div className="mt-6">
            <span className="block text-xs font-medium mb-2">
              Edit Variant Pricing
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium mb-1">
                  MRP
                </label>
                <input
                  type="number"
                  className="w-full rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-none px-3 py-2 text-sm"
                  value={
                    form.colors[selectedColorIndex].sizes[selectedSizeIndex]
                      .mrp || 0
                  }
                  onChange={(e) => {
                    const updatedColors = [...form.colors];
                    updatedColors[selectedColorIndex].sizes[
                      selectedSizeIndex
                    ].mrp = Number(e.target.value);
                    setForm((prev) => ({ ...prev, colors: updatedColors }));
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  className="w-full rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-none px-3 py-2 text-sm"
                  value={
                    form.colors[selectedColorIndex].sizes[selectedSizeIndex]
                      .discountPercentage || 0
                  }
                  onChange={(e) => {
                    const updatedColors = [...form.colors];
                    updatedColors[selectedColorIndex].sizes[
                      selectedSizeIndex
                    ].discountPercentage = Number(e.target.value);
                    setForm((prev) => ({ ...prev, colors: updatedColors }));
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1">
                  Tax %
                </label>
                <input
                  type="number"
                  className="w-full rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-none px-3 py-2 text-sm"
                  value={
                    form.colors[selectedColorIndex].sizes[selectedSizeIndex]
                      .taxPercentage || 0
                  }
                  onChange={(e) => {
                    const updatedColors = [...form.colors];
                    updatedColors[selectedColorIndex].sizes[
                      selectedSizeIndex
                    ].taxPercentage = Number(e.target.value);
                    setForm((prev) => ({ ...prev, colors: updatedColors }));
                  }}
                />
              </div>

              {/* sellingPrice */}
              <div>
                <label className="block text-[11px] font-medium mb-1">
                  Selling Price
                </label>
                <input
                  type="number"
                  className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e0a371] outline-none cursor-not-allowed"
                  value={(() => {
                    const size =
                      form.colors?.[selectedColorIndex]?.sizes?.[
                        selectedSizeIndex
                      ];
                    if (!size) return 0;

                    const mrp = Number(size.mrp || 0);
                    const discount = Number(size.discountPercentage || 0);
                    const tax = Number(size.taxPercentage || 0);

                    const discounted = mrp - (mrp * discount) / 100;
                    const withTax = discounted + (discounted * tax) / 100;
                    return withTax.toFixed(0);
                  })()}
                  title="Selling price can't be edited"
                  disabled
                  onChange={(e) =>
                    handleChange("sellingPrice", Number(e.target.value))
                  }
                  placeholder="0 %"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">To change product image,color,size and More, use <span className="underlined text-blue-600 font-semibold cursor-pointer" onClick={() => navigate(`/products/${product._id}/edit`)}>full view</span></p>

      {/* ───────────────── Action Buttons ───────────────── */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="flex-1 rounded-md border border-gray-400 bg-white py-3 text-sm font-medium hover:bg-gray-100 cursor-pointer transition"
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
