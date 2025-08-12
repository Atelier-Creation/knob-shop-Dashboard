import { useState, useEffect, useRef } from "react";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../api/categoryAPI";
import CategoryCard from "../components/CategoryCard";
import ImageUploader from "../components/ImageUploader";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryFiltersEditor from "../components/CategoryFiltersEditor";

export default function CategoryManager() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [bannerImageData, setBannerImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [imageData, setImageData] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const openFilterModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setSelectedCategoryId(null);
    setIsFilterModalOpen(false);
  };

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

  const resetForm = () => {
    setCategoryName("");
    setBrand("");
    setImageData(null);
    setBannerImageData(null);
    setEditMode(false);
    setEditCategoryId(null);
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
        <div className="p-3 bg-white shadow-md rounded text-sm relative">
          <div className="flex justify-between items-center">
            <span>Category deleted</span>
            <button
              onClick={() => {
                undo = true;
                setCategories((prev) => [deletedCategory, ...prev]);
                clearTimeout(timeoutId);
                toast.dismiss(t.id);
              }}
              className="ml-4 text-black font-medium hover:underline"
            >
              Undo
            </button>
          </div>
          <div className="mt-2 h-1 bg-gray-200 overflow-hidden rounded">
            <div
              className="h-full bg-[#ab7b53] animate-toast-progress"
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
    }, TOAST_DURATION - 4000);
  };

  const handleAddCategory = () => {
    setLoading(true);
    if (!categoryName || !imageData || !bannerImageData) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }
    const payload = {
      category_name: categoryName,
      description: brand,
      categoryImageUrl: imageData,
      bannerImageUrl: bannerImageData,
    };

    if (editMode && editCategoryId) {
      // Update flow
      updateCategory(editCategoryId, payload)
        .then((res) => {
          setCategories((prev) =>
            prev.map((cat) => (cat._id === editCategoryId ? res.data : cat))
          );
          toast.success("Category updated");
          resetForm();
        })
        .catch((err) => {
          console.error("Update error:", err);
          toast.error("Update failed");
        })
        .finally(() => setLoading(false));
    } else {
      // Create flow
      createCategory(payload)
        .then((res) => {
          setCategories((prev) => [...prev, res.data]);
          toast.success("Category added");
          resetForm();
        })
        .catch((err) => {
          console.error("Create error:", err);
          toast.error("Create failed");
        })
        .finally(() => setLoading(false));
    }
  };

  const handleEditClick = (cat) => {
    setEditMode(true);
    setEditCategoryId(cat._id);
    setCategoryName(cat.category_name);
    setBrand(cat.description);
    setImageData(cat.categoryImageUrl);
    setBannerImageData(cat.bannerImageUrl);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="text-gray-700 text-sm mb-2" ref={formRef}>
        Categories & Products /{" "}
        <span className="font-medium">
          {editMode ? "Edit Category" : "Add Category"}
        </span>
      </div>

      <div className="p-5 py-10 border-b-2 border-gray-300 items-end grid md:grid-cols-4 gap-6">
        <div>
          <p className="mb-2 text-sm font-medium">Category Image</p>
          <ImageUploader
            image={imageData}
            onImageUpload={(base64) => setImageData(base64)}
          />
        </div>

        {/* Banner image */}
        <div>
          <p className="mb-2 text-sm font-medium">Banner Image</p>
          <ImageUploader
            image={bannerImageData}
            onImageUpload={(base64) => setBannerImageData(base64)}
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <p className="mb-2 text-sm font-medium">Category Details</p>
          <div className="space-y-4 min-h-[160px]">
            <input
              type="text"
              placeholder="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm"
            />
            <input
              type="text"
              placeholder="Brand/Description"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm"
            />
            <div className="flex gap-3 flex-wrap justify-end">
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
                {loading
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Update Category"
                  : "Add Category"}
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
                  onEdit={() => handleEditClick(cat)}
                >
                  <button
                    onClick={() => openFilterModal(cat._id)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                  >
                    Customize Filters
                  </button>
                </CategoryCard>
              ))}
        </div>
      </div>
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeFilterModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={closeFilterModal}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">Customize Filters</h3>
            {selectedCategoryId && (
              <CategoryFiltersEditor categoryId={selectedCategoryId} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
