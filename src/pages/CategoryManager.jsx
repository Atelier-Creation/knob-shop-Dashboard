import { useState } from "react";
import CategoryCard from "../components/CategoryCard";
import ImageUploader from "../components/ImageUploader";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Beds & Matt",
    products: 200,
    image: "/bed.jpg",
  },
  {
    title: "Cabinets & Storage",
    products: 50,
    image: "/cabinet.jpg",
  },
  {
    title: "Dining Room",
    products: 100,
    image: "/dining.jpg",
  },
  {
    title: "Study & Home Office",
    products: 150,
    image: "/study.jpg",
  },
];

export default function CategoryManager() {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
    const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="p-2 md:p-10 max-w-screen-xl mx-auto space-y-6">
      <div className="text-gray-700 text-sm mb-2">
        Categories & Products / <span className="font-medium">Add Categories</span>
      </div>

      <div className=" p-5 py-10 order border-b-2 border-gray-300 grid md:grid-cols-4 gap-6">
       
           <ImageUploader />

        <div className="md:col-span-3 space-y-4">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-2/3 border border-gray-300 rounded-sm p-2 text-sm"
          />
          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-2/3 border border-gray-300 rounded-sm p-2 text-sm"
          />
          <div className="flex gap-3 flex-wrap">
            <button className="border rounded-sm cursor-pointer px-4 py-2 text-sm">Reset</button>
            <button className="bg-gray-200 rounded-sm cursor-pointer px-4 py-2 text-sm font-medium">
              + Add Category
            </button>
            <Link className="bg-black text-white rounded-sm cursor-pointer px-4 py-2 text-sm font-medium" to={"/categories-products/add"}>
              Continue to Products
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Added Categories</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {categories.map((cat, idx) => (
        <CategoryCard
          key={idx}
          cat={cat}
          isOpen={openIdx === idx}                       // ⇢ drives visibility
          onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
          onClose={() => setOpenIdx(null)}               // ⇢ called by click‑outside
        />
      ))}
        </div>
      </div>
    </div>
  );
}