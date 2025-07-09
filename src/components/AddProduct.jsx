import { useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import ColorVariants from "./ColorVariants";
import FeatureSelector from "./FeatureSelector";

export default function AddProduct() {
  const [productData, setProductData] = useState({
    name: "YDM50NxT Smart Lock",
    mrp: "90000",
    sellingPrice: "89299",
    discount: "05",
    stock: "100",
    productId: "#658945",
    colors: [{ color: "Yellow", price: "90000", code: "#FFD700" }],
    features: ["Bio-Metric"],
    images: [],
    description: "",
    techSpecs: [""],
    productFeatures: [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const handleFeatureImageUpload = (e, index) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const updatedFeatures = [...productData.productFeatures];
    updatedFeatures[index].image = url;
    setProductData({ ...productData, productFeatures: updatedFeatures });
  };

  const addProductFeature = () => {
    setProductData((prev) => ({
      ...prev,
      productFeatures: [
        ...prev.productFeatures,
        { heading: "", description: "", image: "" },
      ],
    }));
  };

  const updateFeature = (index, key, value) => {
    const updated = [...productData.productFeatures];
    updated[index][key] = value;
    setProductData({ ...productData, productFeatures: updated });
  };

  return (
    <div className="px-8 py-6 space-y-6 font-inter text-sm text-[#1c1c1c]">
      <div className="text-lg font-semibold">
        Categories & Products / Add Categories / Add Product
      </div>
      <input
        type="text"
        placeholder="Product Name*"
        defaultValue={productData.name}
        className="border px-3 py-2 w-full rounded outline-none"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="MRP Price*"
          defaultValue={productData.mrp}
          className="border px-3 py-2 rounded outline-none"
        />
        <input
          type="text"
          placeholder="Selling Price*"
          defaultValue={productData.sellingPrice}
          className="border px-3 py-2 rounded outline-none"
        />
        <input
          type="text"
          placeholder="Discount (%)"
          defaultValue={productData.discount}
          className="border px-3 py-2 rounded outline-none"
        />
        <input
          type="text"
          placeholder="Stock Quantity*"
          defaultValue={productData.stock}
          className="border px-3 py-2 rounded outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Product ID*"
        defaultValue={productData.productId}
        disabled
        className="border px-3 py-2 w-full rounded bg-gray-100 text-gray-600"
      />

      <ColorVariants />

      <FeatureSelector
        selected={productData.features}
        setSelected={(features) =>
          setProductData((prev) => ({ ...prev, features }))
        }
      />

      <div>
        <label className="font-medium mb-1 block">Product Images*</label>

        <div className="border border-dashed border-[#C7C7C7] bg-[#F9FCFD] p-6 py-14 rounded-lg text-center relative">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="flex justify-center mb-2">
              <ImagePlus className="w-10 h-10" />
            </div>
            <span className="text-blue-600 font-medium underline">
              Click to Upload
            </span>
          </label>
          <div className="text-gray-500 text-sm">or Drag & Drop</div>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          {productData.images.map((img, i) => (
            <div
              key={i}
              className="relative w-[90px] h-[90px] rounded-md border overflow-hidden group"
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover rounded-md"
              />
              <button
                onClick={() => {
                  const filtered = [...productData.images];
                  filtered.splice(i, 1);
                  setProductData({ ...productData, images: filtered });
                }}
                className="absolute -top-2 -right-2 bg-white text-black rounded-full shadow p-1 hover:bg-red-500 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
<div className="flex">
<div className="left w-1/2 me-6">
          <div className="w-full">
        <div className="flex justify-between items-center mb-2">
        <label className="font-medium block text-sm mb-2">Description*</label>
          <button className="flex items-center gap-1 text-xs text-blue-600 font-medium">
            <img src="/icons/upload.svg" className="w-4 h-4" />
            Upload .txt file
          </button>
        </div>
        <textarea
          className="border border-[#BDBDBD] p-3 w-full rounded resize-none text-sm min-h-[100px]"
          placeholder="Add Description"
        ></textarea>
      </div>
       <div className="w-full mt-6">
  <label className="font-medium block text-sm mb-2">Product Features*</label>

  {/* Upload Interface */}
  <div className="border border-dashed border-[#C7C7C7] bg-[#F9FCFD] p-4 py-14 text-center rounded mb-3">
    <input
      type="file"
      className="hidden"
      onChange={(e) => handleFeatureImageUpload(e, productData.productFeatures.length - 1)}
      id={`feature-image-upload`}
    />
    <label
      htmlFor={`feature-image-upload`}
      className="cursor-pointer text-blue-600 text-sm flex flex-col items-center"
    >
        <ImagePlus/>
      Click to Upload
    </label>{" "}
    <span className="text-sm text-gray-500">or Drag & Drop</span>
  </div>

  {/* Subheading and Description Inputs */}
  <input
    type="text"
    placeholder="Sub Heading"
    className="border border-[#BDBDBD] text-sm px-3 py-2 rounded w-full mb-2"
    value={
      productData.productFeatures.length > 0
        ? productData.productFeatures[productData.productFeatures.length - 1].heading
        : ""
    }
    onChange={(e) =>
      updateFeature(productData.productFeatures.length - 1, "heading", e.target.value)
    }
  />

  <textarea
    placeholder="Add Description"
    className="border border-[#BDBDBD] text-sm px-3 py-2 rounded w-full resize-none mb-2"
    value={
      productData.productFeatures.length > 0
        ? productData.productFeatures[productData.productFeatures.length - 1].description
        : ""
    }
    onChange={(e) =>
      updateFeature(productData.productFeatures.length - 1, "description", e.target.value)
    }
  />

  {/* Save button */}
  <button
    onClick={addProductFeature}
    className="bg-black text-white text-sm font-medium px-6 py-1 rounded ml-auto block"
  >
    Save
  </button>

  {/* Grid preview of saved features */}
  <div className="grid grid-cols-2 gap-4 mt-6">
    {productData.productFeatures
      .filter((feat) => feat.image && feat.heading && feat.description)
      .map((feat, i) => (
        <div key={i} className="text-center">
          <img
            src={feat.image}
            alt="feature"
            className="w-[120px] h-[120px] object-cover rounded mx-auto"
          />
          <p className="text-xs font-medium mt-2">{feat.heading}</p>
          <p className="text-[10px] text-gray-500 leading-tight max-w-[120px] mx-auto">
            {feat.description.slice(0, 100)}
          </p>
        </div>
      ))}
  </div>
</div>

</div>

      <div className="w-1/2 mt-6">
        <label className="font-medium block text-sm mb-2">
          Technical Specifications*
        </label>
        {productData.techSpecs.map((spec, idx) => (
          <input
            key={idx}
            type="text"
            placeholder="Enter Technical Specification"
            className="border border-[#BDBDBD] text-sm px-3 py-2 rounded w-full mb-2"
          />
        ))}
        <button className="text-blue-600 text-sm font-medium mt-1">
          + Add More
        </button>
      </div>
      </div>
     

      <div className="flex justify-end gap-4 mt-6">
        <button className="border border-black px-4 py-2 rounded text-sm font-medium">
          Save Product
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded text-sm font-medium">
          Preview Product
        </button>
        <button className="bg-[#0B5FFF] text-white px-4 py-2 rounded text-sm font-medium">
          Publish
        </button>
      </div>
    </div>
  );
}
