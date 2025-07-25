import { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../api/categoryAPI";
import CategoryCard from "../components/CategoryCard";
import ImageUploader from "../components/ImageUploader";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CategoryManager() {
  const navigate = useNavigate();
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [imageData, setImageData] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    setLoadingCategories(true);
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  function CategorySkeleton() {
    return (
      <div className="border border-gray-200 p-4 rounded animate-pulse space-y-4 bg-white shadow-sm cursor-progress">
        <div className="w-full h-32 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  console.log(categories);

  const resetForm = () => {
    setCategoryName("");
    setBrand("");
    setImageData(null);
    toast.success("Form reseted");
  };

  const handleDeleteCategory = async (id) => {
    const deletedCategory = categories.find((cat) => cat._id === id);
    if (!deletedCategory) return;

    setCategories((prev) => prev.filter((cat) => cat._id !== id));

    let undo = false;
    let timeoutId;

    const TOAST_DURATION = 10000;

    toast.custom(
      (t) => (
        <div className="p-3 bg-white shadow-md rounded text-sm border relative">
          <div className="flex justify-between items-center">
            <span>Category deleted</span>
            <button
              onClick={() => {
                undo = true;
                setCategories((prev) => [deletedCategory, ...prev]);
                clearTimeout(timeoutId);
                toast.dismiss(t.id);
              }}
              className="ml-4 text-blue-600 font-medium hover:underline"
            >
              Undo
            </button>
          </div>
          <div className="mt-2 h-1 bg-gray-200 overflow-hidden rounded">
            <div
              className="h-full bg-blue-500 animate-toast-progress"
              style={{ animationDuration: `${TOAST_DURATION}ms` }}
            />
          </div>
        </div>
      ),
      { duration: TOAST_DURATION }
    );

    timeoutId = setTimeout(async () => {
      if (!undo) {
        try {
          await deleteCategory(id);
        } catch (err) {
          console.error("Delete failed:", err);
          toast.error("Delete failed");
          setCategories((prev) => [deletedCategory, ...prev]);
        }
      }
    }, TOAST_DURATION - 1000);
  };

  const handleAddCategory = () => {
    setLoading(true);
    if (!categoryName || !imageData) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }
    const payload = {
      category_name: categoryName,
      description: brand,
      categoryImageUrl: imageData,
    };

    createCategory(payload)
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        resetForm();
      })
      .catch((err) => console.error("Create error:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="text-gray-700 text-sm mb-2">
        Categories & Products /{" "}
        <span className="font-medium">Add Categories</span>
      </div>

      <div className="p-5 py-10 border-b-2 border-gray-300 grid md:grid-cols-4 gap-6">
        <ImageUploader
          image={imageData}
          onImageUpload={(base64) => setImageData(base64)}
        />

        <div className="md:col-span-3 space-y-4">
          <input
            type="text"
            placeholder="Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-2/3 border border-gray-300 rounded-sm p-2 text-sm"
          />
          <input
            type="text"
            placeholder="Brand/Description"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-2/3 border border-gray-300 rounded-sm p-2 text-sm"
          />
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={resetForm}
              className="border rounded-sm px-4 py-2 text-sm cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleAddCategory}
              disabled={!categoryName || !imageData}
              className="bg-gray-800 text-white rounded-sm px-4 py-2 text-sm disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
            <button
              className="bg-gray-800 text-white rounded-sm px-4 py-2 text-sm font-medium disabled:opacity-70 cursor-pointer"
              onClick={() => {
                handleAddCategory();
                navigate("/categories-products/category/add");
              }}
              disabled={!categoryName || !imageData}
              to="/categories-products/category/add"
            >
              Continue to Products
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Added Categories</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {loadingCategories
            ? Array.from({ length: 4 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : categories.map((cat, idx) => (
                <CategoryCard
                  key={cat._id || idx}
                  cat={cat}
                  isOpen={openIdx === idx}
                  onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
                  onClose={() => setOpenIdx(null)}
                  onDelete={handleDeleteCategory}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
