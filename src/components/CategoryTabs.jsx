import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";

export default function CategoryTabs({ categories, selected, onSelect }) {
  const trackRef = useRef(null);
  const dragData = useRef({
    down: false,
    startX: 0,
    scrollX: 0,
    hasDragged: false,
  });
  const [dragging, setDragging] = useState(false);

  /* ───────── handlers ───────── */
  const handlePointerDown = (e) => {
    const track = trackRef.current;
    if (!track) return;
    dragData.current = {
      down: true,
      startX: e.pageX,
      scrollX: track.scrollLeft,
      hasDragged: false,
    };
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragData.current.down) return;
    e.preventDefault();
    const track = trackRef.current;
    const dx = e.pageX - dragData.current.startX;
    if (Math.abs(dx) > 5) {
      dragData.current.hasDragged = true;
    }
    track.scrollLeft = dragData.current.scrollX - dx;
  };

  const stopDrag = () => {
    if (!dragData.current.down) return;
    dragData.current.down = false;
    setDragging(false);
  };

  const scrollTrack = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 150, behavior: "smooth" });
  };

  return (
    <div className="relative mb-6">
      {/* Scroll Left Button */}
      <button
        onClick={() => scrollTrack(-1)}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hidden md:block"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Tabs */}
      <div
        ref={trackRef}
        className="flex gap-2 px-6 py-1 overflow-x-auto scrollbar-hide w-[380px] md:w-[600px] select-none"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        onPointerCancel={stopDrag}
      >
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => {
              if (dragData.current.hasDragged) return;
              onSelect(cat._id);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full cursor-pointer text-sm whitespace-nowrap transition-colors duration-200 ${
              cat._id === selected
                ? "bg-orange-100 text-black font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scrollTrack(1)}
        className="absolute right-90 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow hidden md:block"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
