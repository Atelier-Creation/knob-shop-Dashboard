import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RxBookmark } from "react-icons/rx";
import "./EssentialAddProduct.css";
import { getAllProducts as getProducts } from "../../api/productApi";
import SearchableProductDropdown from "../SearchableProductDropdown";
import ImageUploader from "../ImageUploader";
import {
  createEssentials,
  updateEssentials,
  getEssentials,
} from "../../api/essentialApi";
import CarouselAdmin from "../CarouselAdmin";

function EssentialAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cardIndex } = location.state || {};
  const [essentials, setEssentials] = useState(null);
  const [appliesTo, setAppliesTo] = useState("all");
  const [products, setProducts] = useState([]);
  const [selectedProducts, SetselectedProducts] = useState("");
  const [cardData, setCardData] = useState(null);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [essentialImage, setEssentialImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);
  console.log(selectedProducts);
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
  const handleImagesUploaded = (uploadedImagesData) =>
    setImages((prev) => [...prev, ...uploadedImagesData]);
  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // Category handlers
  const addCategory = () =>
    setCategories((prev) => [
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

  const handleCategoryImageUpload = (index, img) =>
    updateCategory(index, "categoryImageUrl", img.url);
  const handleCategoryBannerUpload = (index, img) =>
    updateCategory(index, "bannerImageUrl", img.url);
  const handleCategoryImagesUpload = (index, imgs) =>
    updateCategory(index, "images", imgs);

  // Save handler
  // Save handler
  const handleSave = async () => {
    if (!essentials) return;

    const updatedEssentials = { ...essentials };
    const targetCard = updatedEssentials.cards[cardIndex] || {};

    // Basic card data
    targetCard.number = cardData?.cardNumber || targetCard.number;
    targetCard.title = cardData?.cardTitle || targetCard.title;
    targetCard.description =
      cardData?.cardDescription || targetCard.description;
    targetCard.mainHeading = cardData?.mainHeading || targetCard.mainHeading;
    targetCard.mainDescription =
      cardData?.mainDescription || targetCard.mainDescription;

    // Set images separately
    targetCard.bgImage = essentialImage?.url || targetCard.bgImage; // Essential Image
    targetCard.bannerImageUrl =
      bannerImage?.url || bannerImage || targetCard.bannerImageUrl;
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
      <div className="flex items-center gap-1 p-4">
        <h2 className="text-lg font-semibold">
          Essentials Add Products to Card {cardIndex + 1}
        </h2>
      </div>
      <CarouselAdmin />
      <div className="grid gap-4 my-6">
  <label className="block mb-1 text-sm font-medium text-gray-700">
    Select Product
  </label>
  <SearchableProductDropdown
    products={products}
    multiple={true}
    selectedProductIds={selectedProducts}
    onSelectProduct={SetselectedProducts}
  />

  {/* Show selected products */}
  {selectedProducts.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedProducts.map((id) => {
        const product = products.find((p) => p._id === id);
        console.log(product)
        return (
          <div
            key={id}
            className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm"
          >
            <div className="rounded-full bg-white overflow-clip my-1">
              <img src={product.images[0]} className="h-10 w-10 object-contain" alt="" srcset="" />
              {/* {product} */}
              </div>
            <span>{product ? product.name : id}</span>
            <button
              type="button"
              onClick={() =>
                SetselectedProducts(selectedProducts.filter((pid) => pid !== id))
              }
              className="text-gray-500 m-2 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  )}
</div>


      <div className="flex gap-4 mt-6">
        <Link
          to={"/deals-discounts"}
          className="px-4 py-2 text-sm bg-white border border-black text-black rounded flex items-center justify-center gap-2"
        >
          <X className="inline" size={18} /> Cancel
        </Link>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-black text-white rounded flex items-center justify-center gap-2"
        >
          <RxBookmark className="inline" size={18} /> Save
        </button>
      </div>
    </div>
  );
}

export default EssentialAddProduct;
