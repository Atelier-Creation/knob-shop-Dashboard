import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import ProductEditor from "../components/ProductEditor";
import CategoryTabs from "../components/CategoryTabs";
import { getAllProducts } from "../api/productApi";
import { fetchCategories } from "../api/categoryAPI";

export default function ProductManager() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch products
  useEffect(() => {
    setLoadingProducts(true);
    getAllProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Fetch categories
  useEffect(() => {
    setLoadingCategories(true);
    fetchCategories()
      .then((res) => {
        const fetchedCategories = res.data || [];
        setCategories([
          { _id: "all", category_name: "All Products" },
          ...fetchedCategories,
        ]);
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleProductClick = (product, action) => {
    if (action === "edit") {
      setActiveProduct(product);
    } else if (action === "delete") {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );
      if (confirmDelete) {
        setProducts((prev) => prev.filter((p) => p._id !== product._id));
      }
    }
  };


  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          if (!p.category) return false;
          const catId =
            typeof p.category === "object" ? p.category._id : p.category;
          return catId === selectedCategory;
        });

  console.log("Selected:", filteredProducts);
  console.log(
    "Products:",
    products.map((p) => p.category)
  );
  const SkeletonBox = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse ${className}`} >
    </div>
  );

  const ProductGridSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBox key={i} className="h-60 w-full rounded-2xl" />
      ))}
    </div>
  );

  const CategoryTabsSkeleton = () => (
    <div className="flex gap-2 overflow-x-auto p-2">  
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBox key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>
  );

  return (
    <div className="relative flex transition-all duration-300 ease-in-out">
      <div
        className={`transition-all duration-300 ease-in-out p-0 md:p-4 ${
          activeProduct ? "w-3/5" : "w-full"
        }`}
      >
        {loadingCategories ? (
          <CategoryTabsSkeleton />
        ) : (
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        {loadingProducts ? (
          <ProductGridSkeleton />
        ) : (
          <ProductGrid
            category={selectedCategory}
            products={filteredProducts}
            onProductClick={handleProductClick}
            activeProduct={activeProduct}
          />
        )}
      </div>

      {/* ProductEditor */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-full max-w-[440px] bg-white z-10
          transition-transform duration-300 ease-in-out p-4 pb-30 mt-18 overflow-y-auto
          ${activeProduct ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {activeProduct && (
          <ProductEditor
            product={activeProduct}
            onUpdate={(updated) =>
              setProducts((prev) =>
                prev.map((p) => (p._id === updated._id ? updated : p))
              )
            }
            onClose={() => setActiveProduct(null)}
          />
        )}
      </div>
    </div>
  );
}
