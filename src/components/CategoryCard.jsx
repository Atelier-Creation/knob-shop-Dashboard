import React, { useRef } from "react";
import { Plus, Trash2, MoreVertical, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { RetryableImage } from "./RetryableImage";

/* ---------- reusable hook ------------------------------------- */
function useClickOutside(ref, handler) {
  React.useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(); // No need to pass event
    }

    // use "click" instead of "mousedown"
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
}

/* -------------------------------------------------------------- */

export default function CategoryCard({
  cat,
  isOpen,
  onToggle,
  onClose,
  onAdd,
  onDelete,
  onEdit,
  children,
}) {
  const menuRef = useRef(null);
  useClickOutside(menuRef, onClose); // closes on outside click

  return (
    <div
      className="relative rounded-lg border flex border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md"
      key={cat?._id}
    >
      <div className="w-1/2 h-52">
        <RetryableImage
          src={cat.categoryImageUrl}
          alt={cat.category_name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 w-1/2 flex flex-col justify-between space-y-2">
        {/* ─── Title + 3‑dot menu ─────────────────────── */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
              {cat.category_name}
            </h3>
            <p className="text-xs mt-2 text-gray-500">{cat.description}</p>
            <p className="text-xs mt-2 text-gray-500">
              ({cat.productCount} Products)
            </p>
          </div>

          <div ref={menuRef} className="relative">
            {/* trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Toggle button clicked!");
                onToggle();
              }}
              className="text-gray-500 hover:bg-gray-100 cursor-pointer p-1.5 rounded-full"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* dropdown */}
            {isOpen && (
              <div
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md w-42 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit clicked for:", cat._id);
                    onEdit?.(cat);
                    onClose();
                  }}
                  className="w-full px-3 py-2 mt-1 flex items-center cursor-pointer text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit clicked for:", cat._id);
                    onAdd?.(cat);
                    onClose();
                  }}
                  className="w-full px-3 py-2 my-1 flex items-center cursor-pointer text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add To Subpage
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Delete clicked for:", cat._id); // 👈 Add this
                    onDelete(cat._id);
                    setTimeout(() => {
                      onClose();
                    }, 200);
                  }}
                  className="w-full px-3 py-2 mb-1 flex items-center cursor-pointer text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── CTA button ─────────────────────────────── */}
        <Link
          onClick={() => {
            localStorage.setItem("selectedCategoryId", cat._id);
            console.log(cat.category_name);

            localStorage.setItem("selectedCategoryName", cat.category_name);
            localStorage.setItem("selectedDescriptionName", cat.description);
              console.log(localStorage.getItem("selectedCategoryId"));
          }}
          to={`/categories-products/category/${cat._id}`}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          <Plus className="w-4 h-4" /> Add Products
        </Link>
        <div>{children}</div>
      </div>
    </div>
  );
}
