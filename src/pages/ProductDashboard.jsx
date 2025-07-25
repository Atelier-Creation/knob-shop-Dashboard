import { useState } from "react";
import {
  Plus,
  CheckCircle,
  FileText,
  Archive,
  PackageX,
} from "lucide-react";
import FiltersPanel from "../components/productStock/FiltersPanel";
import ProductStockCard from "../components/productStock/ProductStockCard";

const tabOptions = [
  { label: "All", icon: null },
  { label: "Active", icon: CheckCircle },
  { label: "Draft", icon: FileText },
  { label: "Archived", icon: Archive },
  { label: "Out of Stock", icon: PackageX },
];

const sampleProducts = [
  {
    id: 1,
    name: "YDME100NxT Smart Door Lock",
    sku: "YDME100_NxT_BLK",
    retail: "64,199",
    wholesale: "70,299",
    stock: 200,
    sold: 50,
    variants: 6,
    status: "Active",
    image: "/lock1.png",
  },
  {
    id: 2,
    name: "YDM4109A RL Push Pull Smart Lock",
    sku: "YKR-PRO-BL",
    retail: "54,199",
    wholesale: "60,000",
    stock: 121,
    sold: 12,
    variants: 4,
    status: "Active",
    image: "/lock2.png",
  },
  {
    id: 3,
    name: "Luna Pro Smart Lock",
    sku: "Luna Pro_GG",
    retail: "64,199",
    wholesale: "70,299",
    stock: 5,
    sold: 25,
    variants: 6,
    status: "Low",
    image: "/lock3.png",
  },
  {
    id: 4,
    name: "YDM 4115A",
    sku: "YDM_4115_A",
    retail: "64,199",
    wholesale: "70,299",
    stock: 0,
    sold: 500,
    variants: 0,
    status: "Out of Stock",
    image: "/lock1.png",
  },
  {
    id: 5,
    name: "Yale Elite Lock Draft",
    sku: "YALE_ELITE_D",
    retail: "58,000",
    wholesale: "65,000",
    stock: 10,
    sold: 0,
    variants: 2,
    status: "Draft",
    image: "/lock2.png",
  },
  {
    id: 6,
    name: "Knobs Smart Lock Archive",
    sku: "KNOB_ARCHIVE",
    retail: "45,000",
    wholesale: "55,000",
    stock: 0,
    sold: 180,
    variants: 1,
    status: "Archived",
    image: "/lock3.png",
  },
];

export default function ProductDashboard() {
  const [selectedTab, setSelectedTab] = useState("All");

  const filteredProducts =
    selectedTab === "All"
      ? sampleProducts
      : sampleProducts.filter((p) => p.status === selectedTab);

  return (
    <div className="md:p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex  md:items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-semibold">Product & Stock</h1>
        <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm justify-center">
          <Plus className="w-4 h-4" />
          Create New Ad
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 pb-2 overflow-x-auto scrollbar-hide">
        {tabOptions.map(({ label, icon: Icon }) => {
          const isActive = selectedTab === label;

          return (
            <button
              key={label}
              onClick={() => setSelectedTab(label)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors px-3 py-1 border-b-2 ${
                isActive
                  ? "text-black border-black"
                  : "text-gray-500 border-transparent hover:text-black"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <FiltersPanel />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <ProductStockCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
