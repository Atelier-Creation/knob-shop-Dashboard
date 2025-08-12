import React, { useState, useEffect } from "react";
import { getCategoryById, updateCategory } from "../api/categoryAPI";
import { Trash2, X } from "lucide-react";

const CategoryFiltersEditor = ({ categoryId }) => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch category and its filters
  useEffect(() => {
    getCategoryById(categoryId)
      .then(res => {
        setFilters(res.data.filters || []);
        setLoading(false);
      })
      .catch(console.error);
  }, [categoryId]);

  const handleAddFilter = () => {
    setFilters([...filters, { name: "", type: "select", options: [] }]);
  };

  const handleRemoveFilter = (index) => {
    const updated = [...filters];
    updated.splice(index, 1);
    setFilters(updated);
  };

  const handleFilterChange = (index, key, value) => {
    const updated = [...filters];
    updated[index][key] = value;
    setFilters(updated);
  };

  const handleAddOption = (index) => {
    const updated = [...filters];
    updated[index].options.push("");
    setFilters(updated);
  };

  const handleOptionChange = (filterIndex, optionIndex, value) => {
    const updated = [...filters];
    updated[filterIndex].options[optionIndex] = value;
    setFilters(updated);
  };

  const handleRemoveOption = (filterIndex, optionIndex) => {
    const updated = [...filters];
    updated[filterIndex].options.splice(optionIndex, 1);
    setFilters(updated);
  };

  const handleSave = () => {
    updateCategory(categoryId, { filters })
      .then(() => alert("Filters updated successfully!"))
      .catch(console.error);
  };

  if (loading) return <p className="text-center">Loading filters...</p>;

  return (
    <div className="p-4 bg-white rounded">

      {filters.map((filter, idx) => (
        <div key={idx} className="border border-gray-300 p-3 rounded mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Filter name"
              value={filter.name}
              onChange={(e) => handleFilterChange(idx, "name", e.target.value)}
              className="border border-gray-300 rounded p-2 flex-1"
            />
            <select
              value={filter.type}
              onChange={(e) => handleFilterChange(idx, "type", e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="range">Range</option>
            </select>
            <button
              onClick={() => handleRemoveFilter(idx)}
              className="bg-red-500 text-white px-3 rounded"
            >
              <Trash2 size={18}/>
            </button>
          </div>

          {/* Options Editor */}
          {filter.type !== "range" && (
            <div>
              <h4 className="font-medium mb-1">Options:</h4>
              {filter.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={opt}
                    placeholder="Option value"
                    onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                    className="border border-gray-300 rounded p-2 flex-1"
                  />
                  <button
                    onClick={() => handleRemoveOption(idx, optIdx)}
                    className="bg-gray-300 px-3 rounded"
                  >
                    <X size={16}/>
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddOption(idx)}
                className="mt-1 bg-gray-900 text-white px-3 py-2 rounded"
              >
                + Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAddFilter}
          className="border border-gray-900 text-dark px-4 py-2 rounded hover:bg-gray-500 hover:text-white hover:border-gray-500 transition"
        >
          + Add Filter
        </button>
        <button
          onClick={handleSave}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Save Filters
        </button>
      </div>
    </div>
  );
};

export default CategoryFiltersEditor;
