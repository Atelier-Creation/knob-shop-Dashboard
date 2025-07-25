import React, { useState } from "react";
import { createProduct } from "../api/productApi"; // Make sure this path is correct
import {
  Plus,
  ImagePlus,
  X,
  Trash2,
  BadgePlus,
  UploadCloud,
} from "lucide-react";
import ColorVariants from "./ColorVariants"; // Assuming this component handles color variants and their images
import ColorNamer from "color-namer";
import ImageUploader from "./ImageUploader"; // Assuming this component returns a Cloudinary URL
import toast from "react-hot-toast";

import app from "/keyfeaturesIcon/app.svg";
import key from "/keyfeaturesIcon/manual_key.svg";
import card from "/keyfeaturesIcon/card.png";
import biometric from "/keyfeaturesIcon/biometric.svg";
import remote from "/keyfeaturesIcon/remote.svg";

export default function AddProduct() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    sellingPrice: 0,
    mrp: 0,
    stock: 0,
    productId: "",
    status: "active",
    category: "",
    brand: "",
    images: [],
    video: "",
    brochure: "",
    // Initialize with one empty feature object
    productFeatures: [{ heading: "", description: "", image: "" }],
    // Initialize with one empty tech spec object
    techSpecs: [{ title: "", value: "" }],
    variant: [],
    discount: {
      type: "percentage",
      value: 0,
      startDate: "",
      endDate: "",
      isActive: false,
    },
    dimensions: {
      weight: 0,
      height: 0,
      width: 0,
      length: 0,
    },
  });

  const [features, setFeatures] = useState([]); // State for "Key Features" (title, icon)
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [featInput, setFeatInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [picker, setPicker] = useState("#000000");

  const [colors, setColors] = useState([
    {
      hex: "#ffffff",
      name: getSuggestedName("#ffffff"),
      price: null,
      image: "",
      images: [],
    },
  ]);

  const resetForm = () => {
  setProductData({
    name: "",
    description: "",
    sellingPrice: 0,
    mrp: 0,
    stock: 0,
    productId: "",
    status: "active",
    category: "",
    brand: "",
    images: [],
    video: "",
    brochure: "",
    productFeatures: [{ heading: "", description: "", image: "" }],
    techSpecs: [{ title: "", value: "" }],
    variant: [],
    discount: {
      type: "percentage",
      value: 0,
      startDate: "",
      endDate: "",
      isActive: false,
    },
    dimensions: {
      weight: 0,
      height: 0,
      width: 0,
      length: 0,
    },
  });

  setFeatures([]);
  setSelectedIcon(null);
  setFeatInput("");
  setColors([
    {
      hex: "#ffffff",
      name: getSuggestedName("#ffffff"),
      price: null,
      image: "",
      images: [],
    },
  ]);
};


  const cloudName = import.meta.env.cloudinery_name || "dpea4iv0b"; // Corrected env variable name
  const uploadPreset =
    import.meta.env.cloudinery_presetName || "product_upload"; // Corrected env variable name

  function getSuggestedName(hex) {
    const name = ColorNamer(hex).ntc[0]?.name || "Custom Color";
    return name === "Grey" ? "Custom Color" : name;
  }

  async function uploadToCloudinary(file) {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || "Cloudinary upload failed");
      }

      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  }

  const handleSaveProduct = async () => {
    const loadingToast = toast.loading("Saving product...");

    try {
      // Filter out empty features/tech specs before processing
      const validProductFeatures = productData.productFeatures.filter(
        (f) => f.heading || f.description || f.image
      );
      const validTechSpecs = productData.techSpecs.filter(
        (s) => s.title || s.value
      );

      const uploadedMainImages = await Promise.all(
        productData.images
          .map(async (fileOrUrl) => {
            if (typeof fileOrUrl === "string") {
              return fileOrUrl;
            } else if (fileOrUrl instanceof File) {
              return await uploadToCloudinary(fileOrUrl);
            }
            return null;
          })
          .filter(Boolean)
      );

      const uploadedDetailedFeatures = await Promise.all(
        validProductFeatures.map(async (f) => ({
          title: f.heading,
          description: f.description,
          image:
            typeof f.image === "string"
              ? f.image
              : f.image
              ? await uploadToCloudinary(f.image)
              : "",
        }))
      );

      const uploadedVariants = await Promise.all(
        colors.map(async (color) => ({
          title: color.name,
          value: color.hex,
          price: Number(color.price || 0),
          images: color.images[0],
        }))
      );

      // Map key features to the required format
      const mappedKeyFeatures = features.map((f) => {
        const pathParts = f.icon.split("/");
        const filename = pathParts[pathParts.length - 1];
        return {
          title: f.label,
          image: filename || "", // Store only the filename
        };
      });

      const mappedTechSpecs = validTechSpecs.map((s) => ({
        title: s.title || "",
        value: s.value || "",
      }));

      const finalPayload = {
        name: productData.name,
        productId: productData.productId,
        price: Number(productData.sellingPrice),
        compare_price: Number(productData.mrp),
        stock: Number(productData.stock),
        description: productData.description,
        brand: localStorage.getItem("selectedDescriptionName"),
        images: uploadedMainImages,
        video: productData.video,
        brochure: productData.brochure,
        discount: {
          type: productData.discount.type || "percentage",
          value: Number(productData.discount.value || 0),
          startDate: productData.discount.startDate
            ? new Date(productData.discount.startDate).toISOString()
            : new Date().toISOString(),
          endDate: productData.discount.endDate
            ? new Date(productData.discount.endDate).toISOString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: productData.discount.isActive,
        },
        features: uploadedDetailedFeatures,
        key_features: mappedKeyFeatures,
        tech_spec: mappedTechSpecs,
        variant: uploadedVariants,
        category: {
          _id: localStorage.getItem("selectedCategoryId"),
        },
        status: productData.status,
        dimensions: productData.dimensions, // Ensure dimensions are included
      };

      console.log("Final Payload to be sent:", finalPayload);

      const response = await createProduct(finalPayload);

      toast.success("Product created successfully!", { id: loadingToast });
      resetForm();
      console.log("Product created:", response);
    } catch (err) {
      console.error("Failed to create product:", err);
      toast.error("Failed to create product", { id: loadingToast });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const updateField = (keyPath, value) => {
    setProductData((prev) => {
      const keys = keyPath.split(".");
      const updated = { ...prev };

      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        current[k] = { ...current[k] };
        current = current[k];
      }

      current[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    updateField("images", [...productData.images, ...files]);
  };

  const handleFeatureImage = (imageUrl, index) => {
    updateFeatureField(index, "image", imageUrl);
  };

  const addFeature = () => {
    if (!featInput || !selectedIcon) return;
    const exists = features.some((f) => f.label === featInput);
    if (!exists) {
      setFeatures([
        ...features,
        {
          label: featInput,
          icon: selectedIcon.icon,
          iconLabel: selectedIcon.label,
        },
      ]);
      setFeatInput("");
      setSelectedIcon(null);
    }
  };

  const delFeature = (label) => {
    setFeatures(features.filter((f) => f.label !== label));
  };

  const addTechSpec = () => {
    setProductData((prev) => ({
      ...prev,
      techSpecs: [...prev.techSpecs, { title: "", value: "" }],
    }));
  };

  const removeTechSpec = (i) => {
    const updated = productData.techSpecs.filter((_, index) => index !== i);
    // Ensure there's always at least one empty field if all are removed
    setProductData({
      ...productData,
      techSpecs: updated.length > 0 ? updated : [{ title: "", value: "" }],
    });
  };

  const handleTechSpecChange = (i, key, val) => {
    const updated = [...productData.techSpecs];
    updated[i][key] = val;
    updateField("techSpecs", updated);
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

  const removeFeature = (index) => {
    const updated = [...productData.productFeatures];
    updated.splice(index, 1);
    // Ensure there's always at least one empty field if all are removed
    setProductData({
      ...productData,
      productFeatures:
        updated.length > 0
          ? updated
          : [{ heading: "", description: "", image: "" }],
    });
  };

  const updateFeatureField = (index, key, value) => {
    const updated = [...productData.productFeatures];
    updated[index][key] = value;
    setProductData({ ...productData, productFeatures: updated });
  };

  const ICON_OPTIONS = [
    { label: "Biometric", icon: biometric },
    { label: "Card", icon: card },
    { label: "Manual Key", icon: key },
    { label: "App", icon: app },
    { label: "Remote", icon: remote },
  ];

  return (
    <div className="pe-16 ps-8 py-6 space-y-6 font-inter text-sm text-[#1c1c1c]">
      <div className="text-lg font-semibold">
        Categories & Products / Add Category / Add Product
      </div>
      <Section title="Product Name" />
      <Field
        label="Product Name*"
        value={productData.name}
        set={(val) => updateField("name", val)}
        isLabel={false}
        extra="bg-white"
      />
      <Section title="Product Pricing" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <Field
          label="MRP Price*"
          type="number"
          value={productData.mrp}
          set={(val) => updateField("mrp", val)}
          isLabel={false}
          extra="bg-white"
          prefix="₹"
        />
        <Field
          label="Selling Price*"
          type="number"
          value={productData.sellingPrice}
          set={(val) => updateField("sellingPrice", val)}
          isLabel={false}
          extra="bg-white"
          prefix="₹"
        />
        <Field
          label="Stock Quantity*"
          type="number"
          value={productData.stock}
          set={(val) => updateField("stock", val)}
          isLabel={false}
          extra="bg-white"
        />
      </div>
      <Section title="Product Dimensions" subtitle="(for shipping purpose)" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Field
          label="Weight (g)"
          type="number"
          value={productData.dimensions.weight}
          isLabel={false}
          extra="bg-white"
          set={(val) => updateField("dimensions.weight", val)}
          suffix="(G)"
        />
        <Field
          label="Height (mm)"
          type="number"
          value={productData.dimensions.height}
          isLabel={false}
          extra="bg-white"
          set={(val) => updateField("dimensions.height", val)}
          suffix="(Mm)"
        />
        <Field
          label="Width (mm)"
          type="number"
          value={productData.dimensions.width}
          isLabel={false}
          extra="bg-white"
          set={(val) => updateField("dimensions.width", val)}
          suffix="(Mm)"
        />
        <Field
          label="Length (mm)"
          type="number"
          value={productData.dimensions.length}
          isLabel={false}
          extra="bg-white"
          set={(val) => updateField("dimensions.length", val)}
          suffix="(Mm)"
        />
      </div>
      <Section title="Stock Keeping Unit" />
      <Field
        label="SKU*"
        value={productData.productId}
        isLabel={false}
        set={(val) => updateField("productId", val)}
        extra="bg-white"
      />

      <ColorVariants
        colors={colors}
        setColors={setColors}
        picker={picker}
        setPicker={setPicker}
      />

      <Section title="Key Features" />
      <div className="flex flex-row mt-4 sm:flex-row gap-2 items-start sm:items-center">
        <div
          className="flex flex-col gap-1 items-center cursor-pointer"
          title="Pick Icon"
        >
          <button
            onClick={() => setShowModal(true)}
            className="border border-gray-300 p-1.5 rounded-full bg-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            {selectedIcon ? (
              <img
                src={selectedIcon.icon}
                alt={selectedIcon.label}
                className="w-5 h-5"
              />
            ) : (
              <BadgePlus size={14} />
            )}
          </button>
          <p className="text-xs text-gray-500">
            {selectedIcon ? selectedIcon.label : "Add icon"}
          </p>
        </div>
        <input
          value={featInput}
          onChange={(e) => setFeatInput(e.target.value)}
          placeholder="Name of Feature"
          className="flex-1 border border-gray-300 bg-white rounded-md px-2 py-[10px] focus:ring-1 ring-gray-300 outline-0"
        />
        <button
          onClick={addFeature}
          className="p-3 bg-[#0c0c0c] text-white rounded-sm cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.map(({ label, icon }) => (
          <ChipFeature
            key={label}
            text={label}
            Icon={icon}
            del={() => delFeature(label)}
          />
        ))}
      </div>

      {/* Product Images Upload Section */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-sm text-gray-700">
          Product Images *
        </label>

        <label className="flex flex-col items-center justify-center gap-2 w-full h-40 border border-dashed border-blue-300 bg-blue-50 rounded-md cursor-pointer transition hover:bg-blue-100">
          <div className="flex flex-col items-center text-gray-500">
            <ImagePlus size={28} />
            <p className="text-sm font-medium mt-1">
              <span className="text-blue-600 underline">Click to Upload</span>{" "}
              or
            </p>
            <p className="text-xs">Drag & Drop</p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {productData.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {productData.images.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded-md overflow-hidden border shadow-sm"
              >
                <img
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`Product ${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "images",
                      productData.images.filter((_, index) => index !== i)
                    )
                  }
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Section title="Product Video URL" />
      <Field
        label="Product Video URL"
        extra="bg-white"
        isLabel={false}
        value={productData.video}
        set={(val) => updateField("video", val)}
      />
      <Section title="Brochure (PDF)" />
      <div>
        <label className="block mb-1 font-medium">Upload Brochure (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file && file.type === "application/pdf") {
              toast.loading("Uploading brochure...");
              try {
                const url = await uploadToCloudinary(file);
                updateField("brochure", url);
                toast.success("Brochure uploaded!");
              } catch {
                toast.error("Brochure upload failed!");
              } finally {
                toast.dismiss();
              }
            } else {
              toast.error("Please select a valid PDF file.");
            }
          }}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
        />

        {productData.brochure && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Preview:</p>
            <div className="w-[400px] h-[400px] border border-gray-300 rounded-md overflow-hidden">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  productData.brochure
                )}&embedded=true`}
                title="Brochure Preview"
                className="w-full h-full"
                aria-controls="brochure-preview"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Description and Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TextAreaField
            label="Description*"
            option={true}
            extra="bg-white"
            value={productData.description}
            set={(val) => updateField("description", val)}
          />
          <div className="space-y-3">
            <label className="block font-semibold mb-1">
              Product Features*
            </label>
            {/* Render product features */}
            {productData.productFeatures.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-gray-50 rounded-lg p-4 space-y-3 relative"
              >
                <button
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 size={16} />
                </button>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Feature Image
                  </label>

                  <ImageUploader
                    onImageUpload={(imageUrl) =>
                      handleFeatureImage(imageUrl, index)
                    }
                  />
                </div>

                <Field
                  label="Subheading"
                  isLabel={false}
                  value={feature.heading}
                  extra="bg-white"
                  set={(val) => updateFeatureField(index, "heading", val)}
                />

                <TextAreaField
                  label="Add Description"
                  isLabel={false}
                  extra="bg-white"
                  value={feature.description}
                  set={(val) => updateFeatureField(index, "description", val)}
                />
              </div>
            ))}
            <button
              onClick={addProductFeature}
              className="text-gray-600 flex items-center bg-gray-50 text-sm gap-1 cursor-pointer mt-6 border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              <Plus size={14} /> Add More
            </button>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <label className="block font-semibold mb-1">
              Technical Specifications*
            </label>
            {/* Render technical specifications */}
            {productData.techSpecs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <Field
                  value={spec.title}
                  set={(val) => handleTechSpecChange(index, "title", val)}
                  extra="bg-white"
                  className="flex-1 border border-gray-300 rounded-sm focus:ring-1 ring-gray-300 outline-0 p-2 min-h-[60px] resize-none bg-white"
                  placeholder="Tech Spec Title"
                />
                <Field
                  value={spec.value}
                  set={(val) => handleTechSpecChange(index, "value", val)}
                  extra="bg-white"
                  className="flex-1 border border-gray-300 rounded-sm focus:ring-1 ring-gray-300 outline-0 p-2 min-h-[60px] resize-none bg-white"
                  placeholder="Tech Spec Value"
                />
                <button
                  onClick={() => removeTechSpec(index)}
                  className="text-red-500 mt-1 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addTechSpec}
              className="text-gray-600 flex items-center bg-gray-50 text-sm gap-1 cursor-pointer mt-6 border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              <Plus size={14} /> Add More
            </button>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              className="bg-black text-white px-4 py-2 rounded-md font-medium cursor-pointer"
              onClick={handleSaveProduct}
            >
              Save Product
            </button>
            <button className="border border-black text-black px-4 py-2 rounded-md font-medium">
              Preview Product
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Select Icon</h3>
              <X
                className="text-red-700 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon.label}
                  className="flex flex-col items-center gap-1 text-xs border border-gray-300 hover:bg-gray-200 py-6 rounded-sm cursor-pointer"
                  onClick={() => {
                    setSelectedIcon(icon);
                    setShowModal(false);
                  }}
                >
                  <img src={icon.icon} alt={icon.label} className="w-12 h-12" />
                  <span>{icon.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Field = ({
  label,
  value,
  set,
  readOnly,
  prefix,
  isLabel = true,
  suffix,
  extra = "",
  placeholder,
  type = "text",
}) => (
  <div>
    {isLabel && <label className="block mb-1 font-medium">{label}</label>}
    <div className="relative">
      {prefix && (
        <span className="absolute left-2.5 top-[11px] font-bold">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder || label}
        onChange={(e) => set?.(e.target.value)}
        className={`w-full border border-gray-300 rounded-md px-3 py-[10px] focus:ring-1 ring-gray-300 outline-0 ${
          prefix ? "pl-6" : ""
        } ${suffix ? "pr-6" : ""} ${extra}`}
      />
      {suffix && (
        <span className="absolute right-2.5 top-[11px] font-bold">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const TextAreaField = ({
  label,
  option,
  value,
  set,
  placeholder,
  isLabel = true,
  extra,
}) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        set(text); // set the .txt content into textarea
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        {isLabel && <label className="block mb-1 font-medium">{label}</label>}
        {option && (
          <div
            className="text-blue-600 text-xs inline-flex gap-1 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={16} /> Upload .txt File
          </div>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => set?.(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full border border-gray-300 rounded-md px-3 focus:ring-1 ring-gray-300 outline-0 py-2 min-h-[100px] ${extra}`}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept=".txt"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

const ChipFeature = ({ text, del, Icon }) => (
  <div className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-3">
    {Icon && <img src={Icon} alt="icon" className="w-8 h-8 object-contain" />}
    <span>{text}</span>
    <button
      onClick={del}
      className="ml-auto text-gray-500 hover:text-red-600 cursor-pointer"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

const Section = ({ title, action, subtitle = "" }) => (
  <>
    <hr className="border-t border-dashed border-gray-300" />
    <div className="flex gap-2 items-center mt-2 mb-4">
      <h4 className="font-medium">{title}</h4>
      <p className="text-xs text-gray-500">{subtitle}</p>
      {action}
    </div>
  </>
);
