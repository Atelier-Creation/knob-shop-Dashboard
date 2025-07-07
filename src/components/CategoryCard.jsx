import React, { useRef } from "react";
import { Plus, Trash2, MoreVertical, Edit } from "lucide-react";
import { Link } from "react-router-dom";

/* ---------- reusable hook ------------------------------------- */
function useClickOutside(ref, handler) {
  React.useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
/* -------------------------------------------------------------- */

export default function CategoryCard({ cat, isOpen, onToggle, onClose }) {
  const menuRef = useRef(null);
  useClickOutside(menuRef, onClose);            // closes on outside click

  return (
    <div className="relative rounded-lg border flex border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      <img src={cat.image} alt={cat.title} className="w-1/2 h-40 object-cover" />

      <div className="p-4 w-1/2 flex flex-col justify-between">
        {/* ─── Title + 3‑dot menu ─────────────────────── */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">{cat.title}</h3>
            <p className="text-xs mt-2 text-gray-500">({cat.products} Products)</p>
          </div>

          <div ref={menuRef} className="relative">
            {/* trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();             
                onToggle();
              }}
              className="text-gray-500 hover:bg-gray-100 cursor-pointer p-1.5 rounded-full"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md w-28 z-20">
                <button className="w-full px-3 py-2 flex items-center cursor-pointer text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </button>
                <button className="w-full px-3 py-2 flex items-center cursor-pointer text-sm text-red-600 hover:bg-gray-100 rounded-b-lg">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── CTA button ─────────────────────────────── */}
        <Link className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition" to={"/categories-products/add"}>
          <Plus className="w-4 h-4" /> Add Products
        </Link>
      </div>
    </div>
  );
}
