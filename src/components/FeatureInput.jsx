import { useState } from "react";

export default function FeatureInput({ features = [], onChange }) {
  const [input, setInput] = useState({ title: "", image: "" });

  const addFeature = () => {
    if (!input.title.trim()) return;
    const newFeature = {
      title: input.title.trim(),
      image: input.image.trim(),
    };
    onChange([...features, newFeature]);
    setInput({ title: "", image: "" });
  };

  const removeFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          placeholder="Title"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#e0a371]"
        />
        <input
          placeholder="Image URL or name"
          value={input.image}
          onChange={(e) => setInput({ ...input, image: e.target.value })}
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#e0a371]"
        />
        <button
          onClick={addFeature}
          className="px-3 py-1 bg-black text-white rounded-md text-sm"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            {f.image && (
              <img
                src={f.image}
                alt={f.title}
                className="w-6 h-6 object-contain"
              />
            )}
            <span>{f.title}</span>
            <button
              onClick={() => removeFeature(i)}
              className="ml-auto text-xs text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
