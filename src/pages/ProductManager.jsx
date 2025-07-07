import { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ProductEditor from '../components/ProductEditor';
import CategoryTabs from '../components/CategoryTabs';

const categories = ['All Products', 'Living Room', 'Digital Safe lockers', 'Cabinets & Storages'];

const dummyProducts = [
  {
    id: 1,
    name: "YDM4109A RL",
    brand: "Yale",
    category: "Digital Safe lockers",
    mrp: 60199,
    offerPrice: 55699,
    stock: 150,
    sold: 130,
    comparedPercentage: -5,
    image: "/lock1.png",
    colors: ["#FFD700", "#000000"],
    features: ["Fingerprint Access", "Pin Code Access", "Remote Control"],
  },
  {
    id: 2,
    name: "YDM3109A",
    brand: "Yale",
    category: "Living Room",
    mrp: 28990,
    offerPrice: 25990,
    stock: 90,
    sold: 60,
    comparedPercentage: 10,
    image: "/lock2.png",
    colors: ["#000000", "#FFFFFF"],
    features: ["Voice Guide", "Auto Lock", "Mechanical Key Backup"],
  },
  {
    id: 3,
    name: "YDM7100 Smart Door Lock",
    brand: "Yale",
    category: "Cabinets & Storages",
    mrp: 34990,
    offerPrice: 31990,
    stock: 75,
    sold: 70,
    comparedPercentage: 7,
    image: "/lock3.png",
    colors: ["#FFD700", "#FFFFFF"],
    features: ["Bluetooth App Access", "Emergency Power", "Tamper Alarm"],
  },
  {
    id: 4,
    name: "YDF40A",
    brand: "Yale",
    category: "Digital Safe lockers",
    mrp: 20990,
    offerPrice: 18990,
    stock: 50,
    sold: 48,
    comparedPercentage: -3,
    image: "/lock2.png",
    colors: ["#000000"],
    features: ["Biometric Locking", "Dual Access", "Strong Body Construction"],
  },
  {
    id: 5,
    name: "YDM1000NXT",
    brand: "Yale",
    category: "All Products",
    mrp: 27990,
    offerPrice: 24990,
    stock: 200,
    sold: 100,
    comparedPercentage: 25,
    image: "/lock1.png",
    colors: ["#FFD700", "#000000"],
    features: ["Advanced Security", "Smart Touchpad", "RFID Card Support"],
  },
  {
    id: 6,
    name: "YDM4115A",
    brand: "Yale",
    category: "Living Room",
    mrp: 23990,
    offerPrice: 20990,
    stock: 110,
    sold: 90,
    comparedPercentage: -2,
    image: "/lock3.png",
    colors: ["#000000", "#FFFFFF"],
    features: ["Auto Lock", "One-Time Pin", "Fire Detection Sensor"],
  },
  {
    id: 7,
    name: "YDF40A",
    brand: "Yale",
    category: "Digital Safe lockers",
    mrp: 20990,
    offerPrice: 18990,
    stock: 50,
    sold: 48,
    comparedPercentage: -3,
    image: "/lock2.png",
    colors: ["#000000"],
    features: ["Biometric Locking", "Dual Access", "Strong Body Construction"],
  },
  {
    id: 8,
    name: "YDM1000NXT",
    brand: "Yale",
    category: "All Products",
    mrp: 27990,
    offerPrice: 24990,
    stock: 200,
    sold: 100,
    comparedPercentage: 25,
    image: "/lock1.png",
    colors: ["#FFD700", "#000000"],
    features: ["Advanced Security", "Smart Touchpad", "RFID Card Support"],
  },
  {
    id: 9,
    name: "YDM4115A",
    brand: "Yale",
    category: "Living Room",
    mrp: 23990,
    offerPrice: 20990,
    stock: 110,
    sold: 90,
    comparedPercentage: -2,
    image: "/lock3.png",
    colors: ["#000000", "#FFFFFF"],
    features: ["Auto Lock", "One-Time Pin", "Fire Detection Sensor"],
  },
  {
    id: 10,
    name: "YDM4109A RL",
    brand: "Yale",
    category: "Digital Safe lockers",
    mrp: 60199,
    offerPrice: 55699,
    stock: 150,
    sold: 130,
    comparedPercentage: -5,
    image: "/lock1.png",
    colors: ["#FFD700", "#000000"],
    features: ["Fingerprint Access", "Pin Code Access", "Remote Control"],
  },
];

export default function ProductManager() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [products, setProducts] = useState(dummyProducts);
  const [activeProduct, setActiveProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

    const handleProductClick = (product, action) => {
    if (action === "edit") {
      setActiveProduct(product);
    } else if (action === "delete") {
      const confirm = window.confirm(`Are you sure you want to delete "${product.name}"?`);
      if (confirm) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      }
    } else if (action === "preview") {
      setPreviewProduct(product);
    }
  };


  return (
    <div className="relative flex transition-all duration-300 ease-in-out">
      {/* Product Grid - full width or 3/5 */}
      <div className={`transition-all duration-300 ease-in-out p-0 md:p-4 ${activeProduct ? 'w-3/5' : 'w-full'}`}>
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <ProductGrid
          category={selectedCategory}
          products={products}
          onProductClick={handleProductClick}
          activeProduct={activeProduct}
        />
      </div>

      {/* Slide-in ProductEditor */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-[100%] max-w-[440px] bg-white z-0
          transition-transform duration-300 ease-in-out p-4 pb-30 mt-18 overflow-y-auto scrollbar-thick scroll-smooth
          ${activeProduct ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {activeProduct && (
          <ProductEditor
            product={activeProduct}
            onUpdate={(updated) =>
              setProducts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              )
            }
            onClose={() => setActiveProduct(null)}
          />
        )}
      </div>

    {/* Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-40  flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-2 right-3 text-gray-500 cursor-pointer hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-2">{previewProduct.name}</h2>
            <img src={previewProduct.image} alt={previewProduct.name} className="w-full h-48 object-contain bg-gray-100 rounded mb-4" />
            <p className="text-sm text-gray-800 mb-1"><strong className='text-black'>Brand:</strong> {previewProduct.brand}</p>
            <p className="text-sm text-gray-800 mb-1"><strong className='text-black'>Category:</strong> {previewProduct.category}</p>
            <p className="text-sm text-gray-800 mb-1">
              <strong className='text-black'>MRP:</strong> <s className='text-red-500'>₹ {previewProduct.mrp}</s> &nbsp; <strong className='text-black'>Offer:</strong><span className='text-green-600'> ₹ {previewProduct.offerPrice}</span>
            </p>
            <div className="text-xs text-gray-800 mt-2">
              <p className="mb-2 text-sm"><strong className='text-black '>Features:</strong></p>
              <ul className="list-disc list-inside">
                {previewProduct.features.map((f, i) => (
                  <li key={i} className='mb-1'>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
