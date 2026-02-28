import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RxBookmark } from "react-icons/rx";
import "./EssentialAddProduct.css";

import { getProductById, getAllProducts } from "../../api/productApi";
import SearchableProductDropdown from "../SearchableProductDropdown";
import { getEssentials, updateCardInEssentials } from "../../api/essentialApi";
import CarouselAdmin from "../CarouselAdmin";

function EssentialAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cardIndex } = location.state || {};

  const [essentials, setEssentials] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState({});
  const [sliderData, setSliderData] = useState([]);

  const [cardData, setCardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [essentialImage, setEssentialImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);

  useEffect(() => {
    if (essentials && cardIndex != null) {
      const card = essentials.cards[cardIndex];
      setSliderData(card?.sliders || []);
    }
  }, [essentials, cardIndex]);

  // Load cardData
  useEffect(() => {
    if (location.state?.cardData) {
      setCardData(location.state.cardData);
    } else {
      const stored = localStorage.getItem("selectedCardData");
      if (stored) setCardData(JSON.parse(stored));
    }
  }, [location.state]);

  // Load essentials + existing card info
  useEffect(() => {
    const load = async () => {
      try {
        const essentialsRes = await getEssentials();
        const essentialsData = essentialsRes[0];
        setEssentials(essentialsData);

        if (typeof cardIndex === "number") {
          const currentCard = essentialsData.cards?.[cardIndex];

          if (currentCard) {
            if (Array.isArray(currentCard.products)) {
              const ids = currentCard.products.map((p) =>
                typeof p === "object" ? p._id : p
              );
              setSelectedProducts(ids);
            }

            setCategories(currentCard.categories || []);
            setEssentialImage(
              currentCard.bgImage ? { url: currentCard.bgImage } : null
            );
            setBannerImage(
              currentCard.bannerImageUrl
                ? { url: currentCard.bannerImageUrl }
                : null
            );
            setRelatedImages(currentCard.images || []);
          }
        }
      } catch (err) {
        console.error("Failed to load essentials:", err);
      }
    };

    load();
    fetchProducts();
  }, [cardIndex]);

  // Fetch product list for dropdown search
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts({ page: 1, limit: 500 });
      setProducts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Load details for each selected product
  useEffect(() => {
    const loadSelectedProductDetails = async () => {
      for (let id of selectedProducts) {
        if (!selectedProductDetails[id]) {
          try {
            const product = await getProductById(id);
            setSelectedProductDetails((prev) => ({
              ...prev,
              [id]: product,
            }));
          } catch (err) {
            console.error("Failed to fetch product details:", id, err);
          }
        }
      }
    };
    loadSelectedProductDetails();
  }, [selectedProducts]);

  // Save handler
  const handleSave = async () => {
    if (!essentials) return;

    const cardId = essentials.cards[cardIndex]._id;

    const targetCard = {
      number: cardData?.cardNumber || essentials.cards[cardIndex].number,
      title: cardData?.cardTitle || essentials.cards[cardIndex].title,
      description:
        cardData?.cardDescription || essentials.cards[cardIndex].description,
      bgImage: essentialImage?.url || essentials.cards[cardIndex].bgImage,
      bannerImageUrl:
        bannerImage?.url || essentials.cards[cardIndex].bannerImageUrl,
      images: relatedImages.length
        ? relatedImages
        : essentials.cards[cardIndex].images,
      categories,
      products: selectedProducts,
      sliders: sliderData,
    };

    try {
      await updateCardInEssentials(essentials._id, cardId, targetCard);
      alert("Card updated successfully!");
      navigate("/edit-essential");
    } catch (err) {
      console.error("Error updating card:", err);
      alert("Failed to update card.");
    }
  };

  const handleRemoveProduct = async (id) => {
    const updated = selectedProducts.filter((p) => p !== id);
    setSelectedProducts(updated);
    await syncProducts(updated);
  };

  const handleRemoveAllProducts = async () => {
    if (!selectedProducts.length) return;

    if (!window.confirm("Remove all products?")) return;

    setSelectedProducts([]);
    await syncProducts([]);
  };

  const syncProducts = async (updated) => {
    if (!essentials || typeof cardIndex !== "number") return;
    try {
      const updatedEssentials = { ...essentials };
      const targetCard = { ...updatedEssentials.cards[cardIndex] };

      targetCard.products = updated;
      updatedEssentials.cards[cardIndex] = targetCard;

      await updateCardInEssentials(
        essentials._id,
        essentials.cards[cardIndex]._id,
        { products: updated }
      );

      console.log("Products synced");
    } catch (err) {
      console.error("Failed syncing products:", err);
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
        sliders={sliderData}
        cardTitle={essentials?.cards?.[cardIndex]?.title}
        onSliderChange={setSliderData}
      />

      {selectedProducts.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleRemoveAllProducts}
            className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove All Products
          </button>
        </div>
      )}

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

        {selectedProducts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedProducts.map((id) => {
              const product = selectedProductDetails[id];

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

                  <span>{product?.name || "Loading..."}</span>

                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(id)}
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
