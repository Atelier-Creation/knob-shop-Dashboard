import { useEffect, useRef } from "react";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

export function ActionMenu({ isOpen, onToggle, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button onClick={onToggle} className="p-1 rounded cursor-pointer hover:bg-white">
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 origin-top-right bg-white border border-gray-200 rounded shadow-lg z-10">
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100 w-full cursor-pointer"
            onClick={onClose}
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100 w-full cursor-pointer text-red-500"
            onClick={onClose}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
