import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ProductEditor from '../components/ProductEditor';
import CategoryTabs from '../components/CategoryTabs';
import ProductPreview from '../components/ProductPreview';
import { getAllProducts } from '../api/productApi';
import { fetchCategories } from '../api/categoryAPI';


export default function ProductManager() {
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  // Fetch products
  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);
  
  

  // Fetch categories
  useEffect(() => {
  fetchCategories()
    .then((res) => {
      const fetchedCategories = res.data || [];
      setCategories([{ _id: 'all', category_name: 'All Products' }, ...fetchedCategories]);
    })
    .catch((err) => console.error('Error fetching categories:', err));
}, []);

  const handleProductClick = (product, action) => {
    if (action === "edit") {
      setActiveProduct(product);
    } else if (action === "delete") {
      const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"?`);
      if (confirmDelete) {
        setProducts((prev) => prev.filter((p) => p._id !== product._id));
      }
    } else if (action === "preview") {
      setPreviewProduct(product);
    }
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'All Products'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative flex transition-all duration-300 ease-in-out">
      <div className={`transition-all duration-300 ease-in-out p-0 md:p-4 ${activeProduct ? 'w-3/5' : 'w-full'}`}>
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <ProductGrid
          category={selectedCategory}
          products={filteredProducts}
          onProductClick={handleProductClick}
          activeProduct={activeProduct}
        />
      </div>

      {/* ProductEditor */}
      <div className={`
          fixed top-0 right-0 h-screen w-full max-w-[440px] bg-white z-10
          transition-transform duration-300 ease-in-out p-4 pb-30 mt-18 overflow-y-auto
          ${activeProduct ? 'translate-x-0' : 'translate-x-full'}
        `}>
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

      {/* ProductPreview */}
      <div className={`
          fixed top-0 right-0 h-screen w-full max-w-[440px] bg-white z-10
          transition-transform duration-300 ease-in-out p-4 pb-30 mt-18 overflow-y-auto
          ${previewProduct ? 'translate-x-0' : 'translate-x-full'}
        `}>
        {previewProduct && (
          <ProductPreview
            product={previewProduct}
            onClose={() => setPreviewProduct(null)}
            onEdit={(product) => {
              setActiveProduct(product);
              setPreviewProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
