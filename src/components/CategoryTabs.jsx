import { useRef, useState } from "react";

export default function CategoryTabs({ categories, selected, onSelect }) {
  const trackRef = useRef(null);
  const dragData  = useRef({ down: false, startX: 0, scrollX: 0 });
  const [dragging, setDragging] = useState(false);

  /* ───────── handlers ───────── */
  const handlePointerDown = (e) => {
    const track = trackRef.current;
    if (!track) return;
    dragData.current = {
      down:   true,
      startX: e.pageX,
      scrollX: track.scrollLeft,
    };
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragData.current.down) return;
    e.preventDefault();                     
    const track   = trackRef.current;
    const dx      = e.pageX - dragData.current.startX;
    track.scrollLeft = dragData.current.scrollX - dx;
  };

  const stopDrag = () => {
    if (!dragData.current.down) return;
    dragData.current.down = false;
    setDragging(false);
  };

  return (
    <div className="relative mb-6">
      <div
        ref={trackRef}
        className="flex gap-2 px-1 py-1 overflow-x-auto scrollbar-hide w-[380px] md:w-[600px] select-none"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        onPointerCancel={stopDrag}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer text-sm whitespace-nowrap transition-colors duration-200
              ${
                cat === selected
                  ? "bg-orange-100 text-black font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
