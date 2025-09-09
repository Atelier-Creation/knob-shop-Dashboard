import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RxBookmark } from "react-icons/rx";
import './EssentialAddProduct.css';
import { getAllProducts as getProducts } from "../../api/productApi";
import SearchableProductDropdown from "../SearchableProductDropdown";
import ImageUploader from "../ImageUploader";
import { createEssentials, updateEssentials, getEssentials } from "../../api/essentialApi";

function EssentialAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cardIndex } = location.state || {};
  const [essentials, setEssentials] = useState(null);
  const [appliesTo, setAppliesTo] = useState("all");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [cardData, setCardData] = useState(null);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [essentialImage, setEssentialImage] = useState(null);
const [bannerImage, setBannerImage] = useState(null);
const [relatedImages, setRelatedImages] = useState([]);


  // Load selected card data
  useEffect(() => {
    if (location.state?.cardData) setCardData(location.state.cardData);
    else {
      const stored = localStorage.getItem("selectedCardData");
      if (stored) setCardData(JSON.parse(stored));
    }
  }, [location.state]);

  // Fetch essentials & products
  useEffect(() => {
    const loadData = async () => {
      const essentialsRes = await getEssentials();
      setEssentials(essentialsRes[0]);
    };
    loadData();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Image handlers
  const handleImagesUploaded = (uploadedImagesData) => setImages((prev) => [...prev, ...uploadedImagesData]);
  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  // Category handlers
  const addCategory = () => setCategories((prev) => [
    ...prev,
    {
      category_name: "",
      description: "",
      categoryImageUrl: "",
      bannerImageUrl: "",
      images: [],
      subpageType: "",
    },
  ]);

  const updateCategory = (index, key, value) => {
    const updated = [...categories];
    updated[index][key] = value;
    setCategories(updated);
  };

  const handleCategoryImageUpload = (index, img) => updateCategory(index, "categoryImageUrl", img.url);
  const handleCategoryBannerUpload = (index, img) => updateCategory(index, "bannerImageUrl", img.url);
  const handleCategoryImagesUpload = (index, imgs) => updateCategory(index, "images", imgs);

  // Save handler
// Save handler
const handleSave = async () => {
    if (!essentials) return;
  
    const updatedEssentials = { ...essentials };
    const targetCard = updatedEssentials.cards[cardIndex] || {};
  
    // Basic card data
    targetCard.number = cardData?.cardNumber || targetCard.number;
    targetCard.title = cardData?.cardTitle || targetCard.title;
    targetCard.description = cardData?.cardDescription || targetCard.description;
    targetCard.mainHeading = cardData?.mainHeading || targetCard.mainHeading;
    targetCard.mainDescription = cardData?.mainDescription || targetCard.mainDescription;
  
    // Set images separately
    targetCard.bgImage = essentialImage?.url || targetCard.bgImage;      // Essential Image
    targetCard.bannerImageUrl = bannerImage?.url || bannerImage || targetCard.bannerImageUrl;
 // Banner Image
    targetCard.images = relatedImages; // Related Images
  
    // Categories
    targetCard.categories = categories;
  
    // Products if single
    if (appliesTo === "single" && productId) {
      targetCard.products = [...(targetCard.products || []), productId];
    }
  
    updatedEssentials.cards[cardIndex] = targetCard;
  
    try {
        console.log("Data to be saved:", updatedEssentials);
      await updateEssentials(essentials._id, updatedEssentials);
      alert("Essentials updated successfully!");

    } catch (err) {
      console.error(err);
      alert("Failed to update essentials.");
    }
  };
  

  return (
    <div>
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-semibold">Essentials Add Products to Card {cardIndex + 1}</h2>
      </div>

      <form className="space-y-4">
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input type="text" className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer" required />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
              <textarea placeholder="Description" className="w-full border border-gray-300 bg-white rounded-md px-3 focus:ring-1 ring-gray-300 outline-0 py-2 min-h-[100px]" />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Applies To</label>
              <select value={appliesTo} onChange={(e) => setAppliesTo(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer">
                <option value="all">All Products</option>
                <option value="single">A Single Product</option>
              </select>
            </div>

            {appliesTo === "single" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Product</label>
                <SearchableProductDropdown products={products} selectedProductId={productId} onSelectProduct={setProductId} />
              </div>
            )}
          </div>
        </div>

        {/* Card Images */}
        <div className="p-5 py-10 border-b-2 border-gray-300 items-end grid md:grid-cols-4 gap-6">
          <div>
            <p className="mb-2 text-sm font-medium">Essential Image</p>
            <ImageUploader onImageUpload={(imgs) => setEssentialImage(imgs[0])} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Essential Banner Image</p>
            <ImageUploader onImageUpload={(imgs) => {
  console.log("Banner Image Uploaded:", imgs[0]);
  setBannerImage(imgs[0]);
}} />

          </div>
        </div>

        {/* Upload Related Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Related Images</label>
          <ImageUploader multiple={true} onImageUpload={(imgs) => setRelatedImages(imgs)} />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={img.url} alt={`uploaded-${index}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Categories</h3>
          {categories.map((cat, index) => (
            <div key={index} className="border p-3 mb-3 rounded space-y-2">
              <input type="text" placeholder="Category Name" className="w-full border p-1" value={cat.category_name} onChange={(e) => updateCategory(index, "category_name", e.target.value)} />
              <textarea placeholder="Description" className="w-full border p-1" value={cat.description} onChange={(e) => updateCategory(index, "description", e.target.value)} />
              <p>Category Image</p>
              <ImageUploader onImageUpload={(imgs) => handleCategoryImageUpload(index, imgs[0])} />
              <p>Banner Image</p>
              <ImageUploader onImageUpload={(imgs) => handleCategoryBannerUpload(index, imgs[0])} />
              <p>Related Images</p>
              <ImageUploader multiple={true} onImageUpload={(imgs) => handleCategoryImagesUpload(index, imgs)} />
            </div>
          ))}
          <button type="button" onClick={addCategory} className="px-3 py-1 border rounded">+ Add Category</button>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 mt-6">
          <Link to={"/deals-discounts"} className="px-4 py-2 text-sm bg-white border border-black text-black rounded flex items-center justify-center gap-2">
            <X className="inline" size={18} /> Cancel
          </Link>
          <button type="button" onClick={handleSave} className="px-4 py-2 text-sm bg-black text-white rounded flex items-center justify-center gap-2">
            <RxBookmark className="inline" size={18} /> Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EssentialAddProduct;
