import React, { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";

const ProductImageUploader = () => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const previews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-xl w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border border-dashed border-blue-400 rounded-md p-6 text-center cursor-pointer mb-4"
      >
        <div className="flex flex-col items-center justify-center gap-1 text-sm text-gray-500">
          <ImagePlus size={24} className="text-gray-400" />
          <span className="text-blue-600 underline">Click to Upload</span>
          <span>or Drag & Drop</span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Image Previews */}
      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative w-[80px] h-[80px] rounded border border-gray-300 overflow-visible"
          >
            <img
              src={img.url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(img.id)}
              className="absolute z-50 top-[-6px] right-[-6px] bg-white border border-gray-300 rounded-full p-[2px] shadow"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageUploader;
