import React, { useState, useRef } from "react";
import { createBrochure } from "../../api/brochureApi";
import "./Brochure.css";
import toast from "react-hot-toast";

function Brochure() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME || "dpea4iv0b";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET || "product_upload";

  async function uploadToCloudinary(file) {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || "Cloudinary upload failed");
      }

      const data = await res.json();
      return data.secure_url; // The PDF URL
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("❌ Failed to upload to Cloudinary.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || !file) {
      toast.error("All fields are required");
      return;
    }

    const pdfUrl = await uploadToCloudinary(file);
    if (!pdfUrl) return;

    const payload = {
      title: name.trim(),
      category: category.trim(),
      pdfLink: pdfUrl,
    };

    try {
      const response = await createBrochure(payload);
      toast.success("Brochure created successfully!");

      // Reset form
      setName("");
      setCategory("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("❌ Error uploading brochure:", error);
      toast.error("❌ Failed to upload brochure to backend.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pe-16 ps-8 py-6 space-y-6 font-inter text-sm text-[#1c1c1c]"
    >
      <div className="text-lg font-semibold">
        Brochure Management / Add Brochure /
      </div>
      <hr className="border-t border-dashed border-gray-300" />

      {/* Brochure Name */}
      <div>
        <label className="block font-medium mb-1">Brochure Name</label>
        <input
          type="text"
          placeholder="Brochure Name*"
          className="w-full border border-gray-300 rounded-md px-3 py-[10px] focus:ring-1 ring-gray-300 outline-0 bg-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* PDF Upload */}
      <div>
        <label className="block font-medium mb-1">Upload Brochure (PDF)*</label>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-1">Brochure Category Name</label>
        <input
          type="text"
          placeholder="Brochure Category Name*"
          className="w-full border border-gray-300 rounded-md px-3 py-[10px] focus:ring-1 ring-gray-300 outline-0 bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md font-medium cursor-pointer"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Save Brochure"}
        </button>
      </div>
    </form>
  );
}

export default Brochure;
