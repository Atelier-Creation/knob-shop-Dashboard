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
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // ✅ array
  const [cardData, setCardData] = useState(null);

  const [categories, setCategories] = useState([]);
  const [essentialImage, setEssentialImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);

  // Load card data from router or localStorage
  useEffect(() => {
    if (location.state?.cardData) setCardData(location.state.cardData);
    else {
      const stored = localStorage.getItem("selectedCardData");
      if (stored) setCardData(JSON.parse(stored));
    }
  }, [location.state]);

  // Fetch essentials + products
  // Fetch essentials + products
useEffect(() => {
  const loadData = async () => {
    try {
      const essentialsRes = await getEssentials();
      const essentialsData = essentialsRes[0];
      setEssentials(essentialsData);

      if (typeof cardIndex === "number" && essentialsData.cards?.[cardIndex]) {
        const currentCard = essentialsData.cards[cardIndex];

        // ✅ Pre-fill existing products
        if (Array.isArray(currentCard.products)) {
          // if products are stored as objects, extract ids
          const productIds = currentCard.products.map((p) =>
            typeof p === "object" ? p._id : p
          );
          setSelectedProducts(productIds);
        }

        // also restore other card info
        setCategories(currentCard.categories || []);
        setEssentialImage(currentCard.bgImage ? { url: currentCard.bgImage } : null);
        setBannerImage(currentCard.bannerImageUrl ? { url: currentCard.bannerImageUrl } : null);
        setRelatedImages(currentCard.images || []);
      }
    } catch (err) {
      console.error("Failed to fetch essentials:", err);
    }
  };

  loadData();
  fetchProducts();
}, [cardIndex]);


  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!essentials) return;

    const updatedEssentials = { ...essentials };
    const targetCard = { ...updatedEssentials.cards[cardIndex] };

    // Update card fields dynamically
    targetCard.number = cardData?.cardNumber || targetCard.number;
    targetCard.title = cardData?.cardTitle || targetCard.title;
    targetCard.description =
      cardData?.cardDescription || targetCard.description;

    // Images
    targetCard.bgImage = essentialImage?.url || targetCard.bgImage;
    targetCard.bannerImageUrl = bannerImage?.url || targetCard.bannerImageUrl;
    targetCard.images = relatedImages.length
      ? relatedImages
      : targetCard.images;

    // Categories
    targetCard.categories = categories;

    // Products
    targetCard.products = selectedProducts.length
      ? selectedProducts
      : targetCard.products;

    // Put card back in essentials
    updatedEssentials.cards[cardIndex] = targetCard;

    try {
      console.log("Data to be saved:", updatedEssentials);
      await updateEssentials(essentials._id, updatedEssentials);
      alert("Essentials updated successfully!");
      navigate("/edit-essential"); // go back
    } catch (err) {
      console.error(err);
      alert("Failed to update essentials.");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1 p-4">
        <h2 className="text-lg font-semibold">
          Add Essentials {cardData?.cardTitle || ""} Card Details
        </h2>
      </div>

      <CarouselAdmin
        essentials={essentials}
        setEssentials={setEssentials}
        cardIndex={cardIndex}
      />

      {/* Product Selector */}
      <div className="grid gap-4 my-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Select Products
        </label>
        <SearchableProductDropdown
          products={products}
          multiple={true}
          selectedProductIds={selectedProducts}
          onSelectProduct={setSelectedProducts}
        />

        {/* Show selected products */}
        {selectedProducts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedProducts.map((id) => {
              const product = products.find((p) => p._id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm"
                >
                  <div className="rounded-full bg-white overflow-clip my-1">
                    <img
                      src={product?.images?.[0]}
                      className="h-10 w-10 object-contain"
                      alt=""
                    />
                  </div>
                  <span>{product ? product.name : id}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProducts(
                        selectedProducts.filter((pid) => pid !== id)
                      )
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

      {/* Save / Cancel buttons */}
      <div className="flex gap-4 mt-6">
        <Link
          to={"/edit-essential"}
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
