import { useState } from "react";
import { Search } from "lucide-react";
import Dropdown from "../Dropdown";

export default function FiltersPanel() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [productType, setProductType] = useState("");
  const [retailRange, setRetailRange] = useState("");
  const [brand, setBrand] = useState("");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-2">
      {/* Search Input */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-2">
        <div className="flex w-full overflow-hidden border border-gray-300 rounded-full">
          <input
            type="text"
            placeholder="Search here"
            className="flex-1 px-4 py-2 text-sm text-gray-800 bg-white focus:outline-none rounded-l-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-zinc-900 text-white px-4 py-2 rounded-r-full flex items-center justify-center">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dropdowns */}
      <div>
        <Dropdown
          value={category}
          islable={false}
          options={[
            "Living Room",
            "Digital Safe lockers",
            "Cabinets & Storage",
            "Study & Home Office",
            "Beds & Mattresses",
            "Dining Room",
            "Lighting Decor",
            "Furniture",
          ]}
          onChange={(e) => setCategory(e.target.value)}
          label="Choose Category"
        />
      </div>

      <div>
        <Dropdown
          value={stockFilter}
          islable={false}
          options={["Low Stock", "Out of Stock", "In Stock"]}
          onChange={(e) => setStockFilter(e.target.value)}
          label="Apply Stock Filter"
        />
      </div>

      <div>
        <Dropdown
          value={productType}
          islable={false}
          options={["Physical", "Digital", "Bundled", "Dropshipping"]}
          onChange={(e) => setProductType(e.target.value)}
          label="Product Type"
        />
      </div>

      <div>
        <Dropdown
          value={retailRange}
          islable={false}
          options={["0–10K", "10K–25K", "25K–50K", "50K–1L", "1L+"]}
          onChange={(e) => setRetailRange(e.target.value)}
          label="Retail Price Range"
        />
      </div>

      <div>
        <Dropdown
          value={brand}
          islable={false}
          options={["Yale", "Knobs"]}
          onChange={(e) => setBrand(e.target.value)}
          label="Brand"
        />
      </div>
    </div>
  );
}
