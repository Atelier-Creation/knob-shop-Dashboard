import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import ProductEditor from "../components/ProductEditor";
import CategoryTabs from "../components/CategoryTabs";
import { getAllProducts } from "../api/productApi";
import { fetchCategories } from "../api/categoryAPI";
import { ArrowUp } from "lucide-react";

export default function ProductManager() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const observerRef = useRef(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ✅ Fetch categories
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

  // ✅ Fetch products (paginated)
  const fetchProducts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoadingProducts(true);
          setPage(1);
          setHasMore(true);
        } else {
          setLoadingMore(true);
        }

        const params = {
          page: reset ? 1 : page,
          limit: 30,
        };

        if (selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (searchQuery) {
          params.searchQuery = searchQuery;
        }

        const res = await getAllProducts(params);
        const newProducts = res?.data || [];

        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        const totalPages = res?.pagination?.totalPages || 1;
        setHasMore(page < totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProducts(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, searchQuery, page]
  );

  // ✅ Initial load + when category/search changes
  useEffect(() => {
    fetchProducts(true);
  }, [selectedCategory, searchQuery]);

  // ✅ Infinite scroll for “All Products”
  useEffect(() => {
    if (!hasMore) return;
    let timer;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loadingMore) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            setPage((prev) => prev + 1);
          }, 100); // slight debounce for smoother UX
        }
      },
      {
        root: null,
        rootMargin: "800px",
        threshold: 0,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      clearTimeout(timer);
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [hasMore, loadingMore, selectedCategory]);

  // ✅ Load more when page increments
  useEffect(() => {
    if (page > 1) {
      fetchProducts();
    }
  }, [page]);

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

  // ✅ Skeletons
  const SkeletonBox = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse ${className}`}></div>
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
      {/* Left section */}
      <div
        className={`transition-all duration-300 ease-in-out p-0 md:p-4 ${
          activeProduct ? "w-3/5" : "w-full"
        }`}
      >
        {searchQuery ? (
          <h2 className="font-medium text-xl mb-5">
            Search Result for <strong>"{searchQuery}"</strong>
          </h2>
        ) : null}

        {/* Category Tabs */}
        {searchQuery ? null : loadingCategories ? (
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
          <>
            <ProductGrid
              category={selectedCategory}
              products={products}
              onProductClick={handleProductClick}
              activeProduct={activeProduct}
            />

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerRef} className="h-10 mt-6 flex justify-center">
                {loadingMore ? (
                  <p className="text-gray-500 text-sm">Loading more...</p>
                ) : (
                  <>
                    <p>
                      auto reload if not click here to{" "}
                      <a
                        onClick={() => setPage((prev) => prev + 1)}
                        className="text-sm font-medium text-blue-800 hover:underline"
                      >
                        Reload
                      </a>
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right section */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[440px] bg-white z-10 
          transition-transform duration-300 ease-in-out p-4 pb-30 mt-18 overflow-y-auto 
          ${activeProduct ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeProduct && (
          <ProductEditor
            product={activeProduct}
            onUpdate={async () => {
              await fetchProducts(true);
              setActiveProduct(null);
            }}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-0 right-0 z-50 p-3 rounded-full cursor-pointer bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
