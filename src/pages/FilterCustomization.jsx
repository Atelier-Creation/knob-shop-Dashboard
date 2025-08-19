import { useState } from "react";

export function FilterCustomization({ category, onSave, onCancel }) {
  const [filters, setFilters] = useState(category.filters || []);

  const [newFilter, setNewFilter] = useState({
    label: "",
    type: "checkbox",
    options: "",
  });

  const addFilter = () => {
    if (!newFilter.label) return alert("Enter filter label");
    const options = newFilter.options
      ? newFilter.options.split(",").map((o) => o.trim())
      : [];
    setFilters((prev) => [
      ...prev,
      { id: Date.now().toString(), label: newFilter.label, type: newFilter.type, options },
    ]);
    setNewFilter({ label: "", type: "checkbox", options: "" });
  };

  const removeFilter = (id) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const saveFilters = () => {
    onSave(filters);
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-lg mx-auto">
      <h3 className="font-semibold mb-4">Customize Filters for {category.category_name}</h3>

      <div className="space-y-3 mb-4">
        {filters.map((filter) => (
          <div key={filter.id} className="flex justify-between items-center">
            <span>
              {filter.label} ({filter.type}) - {filter.options.join(", ")}
            </span>
            <button
              onClick={() => removeFilter(filter.id)}
              className="text-red-600 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        <input
          placeholder="Filter label"
          value={newFilter.label}
          onChange={(e) => setNewFilter({ ...newFilter, label: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <select
          value={newFilter.type}
          onChange={(e) => setNewFilter({ ...newFilter, type: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="checkbox">Checkbox</option>
          <option value="dropdown">Dropdown</option>
          <option value="text">Text</option>
        </select>
        <input
          placeholder="Options (comma separated)"
          value={newFilter.options}
          onChange={(e) => setNewFilter({ ...newFilter, options: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <button onClick={addFilter} className="bg-blue-600 text-white px-3 py-1 rounded">
          Add Filter
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={saveFilters}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Filters
        </button>
      </div>
    </div>
  );
}
