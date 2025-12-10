import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createCoupon } from "../api/dealsApi";
import { getAllProduct } from "../api/productApi";
import { RxBookmark } from "react-icons/rx";
import SearchableProductDropdown from "../components/SearchableProductDropdown";

const couponTypes = ["percentage", "flat"]; // 'bundle' is removed

const CreateCouponPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [type, setType] = useState(couponTypes[0]);
  const [value, setValue] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [appliesTo, setAppliesTo] = useState("all");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProduct();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const couponData = {
      code: code.toUpperCase(),
      type,
      value: Number(value), // 'bundle' logic is removed
      expiryDate,
      isActive: !scheduled,
      scheduled,
      startDate: scheduled ? startDate : new Date().toISOString(),
      appliesTo,
      productId: appliesTo === "single" ? productId : null,
    };

    try {
      await createCoupon(couponData);
      toast.success("Coupon created successfully!");
      navigate("/deals-discounts");
    } catch (err) {
      console.error("Failed to create coupon:", err);
      toast.error("Failed to create coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 md:p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Page Title */}
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-semibold">Deals & Discounts</h2>
        <p className="text-xs text-gray-500">/ Create New Coupon</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-center space-x-2">
              <input
                id="scheduled"
                type="checkbox"
                className="rounded text-black"
                hidden
              />
              <label htmlFor="scheduled" className="text-sm font-medium text-gray-700">
                Create New Coupon's
              </label>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Coupon Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
              >
                {couponTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Value ({type === "percentage" ? "%" : "₹"})
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                required
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                id="scheduled"
                type="checkbox"
                checked={scheduled}
                onChange={(e) => setScheduled(e.target.checked)}
                className="rounded text-black"
              />
              <label htmlFor="scheduled" className="text-sm font-medium text-gray-700">
                Schedule this coupon for a future date
              </label>
            </div>

            {scheduled && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                  required={scheduled}
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Applies To
              </label>
              <select
                value={appliesTo}
                onChange={(e) => setAppliesTo(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="single">A Single Product</option>
              </select>
            </div>

            {appliesTo === "single" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Select Product
                </label>
                <SearchableProductDropdown
                  products={products}
                  selectedProductId={productId}
                  onSelectProduct={setProductId}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 mt-6">
          <Link
            to={"/deals-discounts"}
            className="px-4 py-2 text-sm bg-white border border-black text-black rounded flex items-center justify-center gap-2"
          >
            <X className="inline" size={18} />Cancel 
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-black text-white rounded flex items-center justify-center gap-2"
          >
            <RxBookmark className="inline" size={18} />{" "}
            {loading ? "Creating..." : "Save & Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCouponPage;