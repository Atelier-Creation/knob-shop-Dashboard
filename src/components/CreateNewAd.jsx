import React, { useState } from "react";
import { ImagePlus, CalendarDays, Upload, Eye } from "lucide-react";
import { VscEye } from "react-icons/vsc";
import { RxBookmark } from "react-icons/rx";
import Dropdown from "./Dropdown";

const CreateNewAd = () => {
  const [adData, setAdData] = useState({
    mode: "Single Ad Section",
    title: "",
    description: "",
    type: "Banner",
    image: null,
    imagePreview: null,
    category: "Homepage",
    url: "",
    fromDate: "",
    toDate: "",
    cta: "Shop Now",
  });

    const [selected, setSelected] = useState("Homepage");

  const handleInputChange = (e) => {
    setAdData({ ...adData, [e.target.name]: e.target.value });
  };

  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    previewImage(file);
  };

  const previewImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdData({ ...adData, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      previewImage(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
    <div className="flex items-center">
          <h2 className="text-lg font-semibold me-1">Homepage Ads</h2>
          <p className="text-sm text-gray-500">/ Create New</p>
        </div>
    <div className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm font-medium text-gray-800">
      {/* Form Panel */}
      <div className="space-y-5">
        <Dropdown
          label="Choose Display Mode"
          name="mode"
          value={adData.mode}
          onChange={handleInputChange}
          options={["Single Ad Section", "Split Banner"]}
        />

        <div>
          <label className="block mb-1">Ad Title</label>
          <input
            type="text"
            name="title"
            className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
            placeholder="MAKE A KITCHEN PART OF THE FAMILY"
            value={adData.title}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block mb-1">Ad Description</label>
          <textarea
            name="description"
            className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
            rows={3}
            value={adData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ad Type
          </label>

          {/* Dropdown */}
          <select
            name="type"
            value={adData.type}
            onChange={(e) => setAdData({ ...adData, type: e.target.value })}
            className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
          >
            <option value="Banner">Banner</option>
            <option value="Video">Video</option>
          </select>

          {/* Upload & Preview */}
          <div className="flex gap-3 mt-3">
            {/* Upload Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`w-1/3 h-38 border-2 rounded flex flex-col items-center justify-center cursor-pointer transition ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-dashed border-gray-300 hover:border-gray-400"
              }`}
            >
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 text-center leading-4">
                  Drag and drop or{" "} 
                  <br />
                  click to upload an image
                </span>
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>

            {/* Preview Image */}
            {adData.imagePreview && (
              <img
                src={adData.imagePreview}
                alt="Preview"
                className="w-2/3 h-38 rounded object-cover border border-gray-200"
              />
            )}
          </div>
        </div>

        <div>
          <Dropdown
            label="Target Page"
            value={selected}
            options={[
              "Homepage",
              "Category Page",
              "Product Page",
              "Living Room",
              "Digital Safe Lockers",
              "Dining Room",
              "Kitchen",
            ]}
            onChange={setSelected}
          />
        </div>

        <div>
          <label className="block mb-1">Link to Landing Page</label>
          <input
            type="url"
            name="url"
            className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
            placeholder="https://example.com/page"
            value={adData.url}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">From Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="date"
                name="fromDate"
                className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 pl-8 rounded-md text-sm px-3 py-2"
                value={adData.fromDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">To Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="date"
                name="toDate"
                className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm pl-8"
                value={adData.toDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1">CTA Button Text</label>
          <input
            type="text"
            name="cta"
            className="w-full border bg-white border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
            value={adData.cta}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button className="bg-gray-200 px-4 py-2 rounded">
            <VscEye className="inline" size={18} /> Preview Ad
          </button>
          <button className="bg-black text-white px-4 py-2 rounded">
            <RxBookmark className="inline" size={18} /> Save & Publish
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className=" p-4 rounded-xl h-full">
        {adData.imagePreview && adData.title && adData.description ? (
          <div className="bg-white border border-gray-200 shadow p-4 rounded-lg">
            <h2 className="text-base font-semibold capitalize mb-3">Preview</h2>

            <img
              src={adData.imagePreview}
              alt="Ad Preview"
              className="rounded mb-3 h-60 w-full object-cover object-center"
            />

            <div className="flex flex-col justify-between gap-3">
              <h3 className="text-lg font-bold my-1">{adData.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{adData.description}</p>

              <button className="mt-auto px-4 py-1.5 w-32 bg-black text-white text-sm rounded hover:bg-gray-800 transition">
                {adData.cta || "Learn More"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-center h-full bg-white">
            <p className="text-gray-400 font-normal mt-6">Add ad details for preview</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CreateNewAd;
