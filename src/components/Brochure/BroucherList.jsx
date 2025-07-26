import React, { useState, useEffect } from "react";
import { getAllBrochures } from "../../api/brochureApi";
import './Brochure.css'
function BroucherList() {
  const [brochures, setBrochures] = useState([]);
  const [filteredBrochures, setFilteredBrochures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch all brochures
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllBrochures();
        const allBrochures = res.brochures || [];
        setBrochures(allBrochures);

        // Extract unique categories for the dropdown
        const uniqueCategories = [
          "All",
          ...new Set(allBrochures.map((b) => b.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching brochures:", err);
      }
    };
    fetchData();
  }, []);

  // Apply filtering + sorting
  useEffect(() => {
    let temp = [...brochures];

    if (searchTerm.trim() !== "") {
      temp = temp.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      temp = temp.filter((item) => item.category === selectedCategory);
    }

    if (sortOption === "title") {
      temp.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "category") {
      temp.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredBrochures(temp);
  }, [searchTerm, selectedCategory, brochures, sortOption]);

  const handleSort = (option) => {
    setSortOption(option);
    setSortVisible(false);
  };

  return (
    <div className="broucher-con">
      <h2 className="font-semibold text-xl mb-4">Brochure List</h2>

      <div className="brouche-search-filter-con">
        <div className="broucher-search-box-icon">
          <input
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>

        <div className="choose-category-wrapper" title="Sort Options">
          <button
            className="choose-category-button"
            onClick={() => setSortVisible(!sortVisible)}
          >
            Sort By
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`lucide lucide-chevron-down ml-2 transition-transform ${
                sortVisible ? "rotate-180" : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {sortVisible && (
            <div className="broucher-sort-dropdown">
              <div onClick={() => handleSort("title")}>Name (A-Z)</div>
              <div onClick={() => handleSort("category")}>Category (A-Z)</div>
              <div onClick={() => handleSort("newest")}>Newest First</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mt-10">
        {filteredBrochures.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-lg border border-gray-300 bg-white shadow-md overflow-hidden"
          >
            <div className="w-full h-64 overflow-hidden">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  item.pdfLink
                )}&embedded=true`}
                title={`Brochure for ${item.title}`}
                className="w-full h-full"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                Category: {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BroucherList;
