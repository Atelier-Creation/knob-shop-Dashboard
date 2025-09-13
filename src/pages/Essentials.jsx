import React, { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RxBookmark } from "react-icons/rx";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  createEssentials,
  updateEssentials,
  getEssentials,
} from "../api/essentialApi";
import { fetchCategories } from "../api/categoryAPI";

// Configure DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_DO_SPACES_KEY,
    secretAccessKey: import.meta.env.VITE_DO_SPACES_SECRET,
  },
});

async function uploadToSpaces(file) {
  if (!file) return null;

  const bucketName = "knobsshopcdn";
  const fileKey = `uploads/${Date.now()}-${file.name}`;

  try {
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: fileKey,
        Body: file,
        ACL: "public-read",
        ContentType: file.type,
      },
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();

    const publicUrl = `https://${bucketName}.blr1.digitaloceanspaces.com/${fileKey}`;
    return publicUrl;
  } catch (err) {
    console.error("Error uploading to Spaces:", err);
    throw err;
  }
}

const Essentials = () => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [mainHeading, setMainHeading] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [mainDescription, setMainDescription] = useState("");
  const [cards, setCards] = useState([
    {
      number: "",
      title: "",
      description: "",
      categories: [],
      imageFile: null,
      bgImage: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);

  // Combine data fetching into a single useEffect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories first
        const categoriesRes = await fetchCategories();
        setAllCategories(categoriesRes.data || []);

        // Then fetch essentials
        const essentialsRes = await getEssentials();
        const essentialData = essentialsRes?.[0];

        if (essentialData) {
          setEditId(essentialData._id);
          setMainHeading(essentialData.mainHeading);
          setMainDescription(essentialData.mainDescription);
          setCards(
            essentialData.cards.map((card) => ({
              ...card,
              // Map the existing category objects to just their _id
              categories: card.categories.map((cat) => cat._id),
              imageFile: null,
            }))
          );
        } else {
          setToastType("success");
          setToastMessage("No existing data found. Creating a new entry.");
          setEditId(null);
          setMainHeading("");
          setMainDescription("");
          setCards([
            {
              number: "",
              title: "",
              description: "",
              categories: [],
              products: [],
              imageFile: null,
              bgImage: "",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setToastType("error");
        setToastMessage("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMainTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "mainHeading") {
      setMainHeading(value);
    } else if (name === "mainDescription") {
      setMainDescription(value);
    }
  };

  const handleCardChange = (index, e) => {
    const { name, value } = e.target;
    const newCards = [...cards];
    newCards[index][name] = value;
    setCards(newCards);
  };

  const handleImageChange = (index, e) => {
    const newCards = [...cards];
    newCards[index].imageFile = e.target.files[0];
    setCards(newCards);
  };

  const handleCategoryChange = (index, categoryId) => {
    const newCards = [...cards];
    const cardCategories = newCards[index].categories;
    const categoryIndex = cardCategories.indexOf(categoryId);

    if (categoryIndex === -1) {
      newCards[index].categories = [...cardCategories, categoryId];
    } else {
      newCards[index].categories.splice(categoryIndex, 1);
    }
    setCards(newCards);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const getCategoryNames = (selectedIds) => {
    return selectedIds
      .map((id) => {
        const category = allCategories.find((cat) => cat._id === id);
        return category ? category.category_name : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const addCard = () => {
    if (cards.length < 3) {
      setCards([
        ...cards,
        {
          number: "",
          title: "",
          description: "",
          categories: [],
          products: [],
          imageFile: null,
          bgImage: "",
        },
      ]);
      setToastMessage("");
    } else {
      setToastType("error");
      setToastMessage("You can only add a maximum of 3 cards.");
    }
  };

  const removeCard = (index) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
    setToastMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedCards = await Promise.all(
        cards.map(async (card) => {
          if (card.imageFile) {
            const imageUrl = await uploadToSpaces(card.imageFile);
            return {
              ...card,
              bgImage: imageUrl,
            };
          }
          return card;
        })
      );

      // The payload for categories will be an array of _ids
      const payload = {
        mainHeading,
        mainDescription,
        cards: uploadedCards.map(
          ({ number, title, description, categories, products, bgImage, _id }) => ({
            number,
            title,
            description,
            categories,
            products,
            bgImage,
            _id,
          })
        ),
      };

      let response;
      if (editId) {
        response = await updateEssentials(editId, payload);
      } else {
        response = await createEssentials(payload);
      }

      console.log("Form submitted successfully:", response.data);
      setToastType("success");
      setToastMessage("Form saved and published successfully!");
      // Navigate to the updated page using the new/updated ID
      // navigate(`/essentials/${response.data._id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setToastType("error");
      setToastMessage("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="p-0 md:p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {toastMessage && (
        <div
          className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded-sm shadow-lg ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toastMessage}
        </div>
      )}
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-semibold">Essentials Section</h2>
        <p className="text-xs text-gray-500">
          / {editId ? "Edit Existing" : "Create New"} Card
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-6 rounded-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <label
              htmlFor="main-heading"
              className="text-sm font-medium text-gray-700"
            >
              Section Details
            </label>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Section Heading
            </label>
            <input
              type="text"
              name="mainHeading"
              value={mainHeading}
              onChange={handleMainTextChange}
              className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
              placeholder="e.g., Essential Details, Elevated Living"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Section Description
            </label>
            <textarea
              name="mainDescription"
              value={mainDescription}
              onChange={handleMainTextChange}
              rows="3"
              className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
              placeholder="A brief description for the section."
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {cards.map((card, index) => (
            <div
              key={card._id || index}
              onClick={() => {
                const selectedCardData = {
                  cardNumber: card.number,
                  cardTitle: card.title,
                  cardDescription: card.description,
                  bgImage: card.bgImage,
                  mainHeading,
                  mainDescription,
                };
            
                // 1. Console log
                console.log("Selected Card Data:", selectedCardData);
            
                // 2. Save to localStorage
                localStorage.setItem("selectedCardData", JSON.stringify(selectedCardData));
            
                // 3. Navigate with state
                navigate("/essential/add-product", {
                  state: { cardIndex: index, cardData: selectedCardData },
                });
              }}
              className="bg-white p-6 rounded-sm border border-gray-200 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div className="flex justify-between items-center space-x-2 mb-4">
                <label
                  htmlFor={`card-details-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Card {index + 1}
                </label>
                {cards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-6">
                <div className="w-full space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={card.number}
                      onChange={(e) => handleCardChange(index, e)}
                      className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                      placeholder="e.g., 01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={card.title}
                      onChange={(e) => handleCardChange(index, e)}
                      className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                      placeholder="e.g., Living Room"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={card.description}
                      onChange={(e) => handleCardChange(index, e)}
                      rows="3"
                      className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                      placeholder="A brief description for the card."
                      required
                    />
                  </div>
                  {/* <div className="relative">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Categories
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(index)}
                      className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                    >
                      <span>
                        {card.categories?.length > 0
                          ? getCategoryNames(card.categories)
                          : "Select categories"}
                      </span>
                      <ChevronDown size={18} />
                    </button>
                    {openDropdownIndex === index && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-40 overflow-y-auto"
                      >
                        {allCategories.map((category) => (
                          <label
                            key={category._id}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={card.categories.includes(category._id)}
                              onChange={() => handleCategoryChange(index, category._id)}
                              className="mr-2"
                            />
                            {category.category_name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div> */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Background Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(index, e)}
                      className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                      accept="image/*"
                    />
                    {card.imageFile && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(card.imageFile)}
                          alt="Selected preview"
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                    {card.bgImage && !card.imageFile && (
                      <div className="mt-2">
                        <img
                          src={card.bgImage}
                          alt="Current preview"
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={addCard}
            className={`px-4 py-2 text-sm rounded flex items-center justify-center gap-2 ${
              cards.length >= 3
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-gray-200"
            }`}
          >
            <Plus size={18} /> Add Card
          </button>
        </div>
        {/* <div className="flex gap-4 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm bg-white border border-black text-black rounded flex items-center justify-center gap-2"
          >
            <X className="inline" size={18} />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-black text-white rounded flex items-center justify-center gap-2"
          >
            <RxBookmark className="inline" size={18} />{" "}
            {loading ? "Saving..." : "Save & Publish"}
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default Essentials;