export default function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="relative mb-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-1 md:flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors duration-200
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
