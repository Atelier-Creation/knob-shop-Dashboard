import { useState } from "react";
import { ImageIcon } from "lucide-react";
import Dropdown from "./Dropdown";
import { VscEye } from "react-icons/vsc";
import { RxBookmark } from "react-icons/rx";
import { Link } from "react-router-dom";
import { createAd } from "../api/adApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const CreateDealForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    appliesTo: "",
    discountType: "",
    discountValue: "",
    minPurchase: "",
    ctaText: "",
    fromDate: "",
    toDate: "",
    banner: null,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

// Configure DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "us-east-1", // This value doesn't matter for DO, but is required
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

    // Construct the public URL
    const publicUrl = `https://${bucketName}.blr1.cdn.digitaloceanspaces.com/${fileKey}`;
    return publicUrl;
  } catch (err) {
    console.error("Error uploading to Spaces:", err);
    throw err;
  }
}
const handleSubmit = async () => {
  try {
    let imageUrl = null;

    // 1. Upload to Spaces if banner exists
    if (form.banner) {
      toast.loading("Uploading image...");
      imageUrl = await uploadToSpaces(form.banner);
      toast.dismiss(); // remove loading
    }

    // 2. Build JSON payload with image URL
    const payload = {
      title: form.title,
      adMode: form.mode === "Single Ad Section" ? "single" : "multiple",
      description: form.description,
      appliesTo: form.appliesTo,
      discountType: form.discountType,
      discountValue: form.discountValue,
      minPurchase: form.minPurchase,
      ctaButton: form.ctaText,
      fromDate: form.fromDate,
      toDate: form.toDate,
      image: imageUrl, // ✅ now URL from DO Spaces
    };

    // 3. Call API
    const res = await createAd(payload);

    toast.success("Deal created successfully!");
    console.log("✅ Deal Created:", res);

    // reset or navigate if needed
    // setForm(initialState);
    // navigate("/deals-discounts");
  } catch (err) {
    toast.dismiss();
    toast.error("Failed to create deal");
    console.error("❌ Error creating deal:", err.response?.data || err.message);
  }
};


  return (
    <div className="p-0 md:p-6 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Page Title */}
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-semibold">Deals & Discounts</h2>
        <p className="text-sm text-gray-500">/ Create New Deal</p>
      </div>

      {/* Left-Right Form Split */}
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Deal Title</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <Dropdown
            label="Applies To"
            value={form.appliesTo}
            options={["All Products", "Kitchen", "Living Room", "Dining"]}
            onChange={(val) => handleChange("appliesTo", val.target.value)}
          />

          <Dropdown
            label="Set Discount Type"
            value={form.discountType}
            options={["Percentage", "Flat ₹ Off", "Buy 1 Get 1"]}
            onChange={(val) => handleChange("discountType", val.target.value)}
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Discount Value</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
              value={form.discountValue}
              onChange={(e) => handleChange("discountValue", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload banner / image</label>
            <div className="flex items-center gap-4 p-2 bg-white border border-gray-300 rounded-md">
              <label className="flex flex-col items-center justify-center w-1/2 h-36 border border-dashed border-gray-300 rounded-md cursor-pointer">
                <ImageIcon className="w-6 h-6 text-gray-500" />
                <span className="text-xs text-gray-500">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleChange("banner", e.target.files[0])}
                />
              </label>
              {form.banner ? (
                <img
                  src={URL.createObjectURL(form.banner)}
                  alt="Banner"
                  className="w-1/2 h-36 object-cover rounded-md"
                />
              ) : (
                <div className="w-1/2 h-36 bg-gray-50 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-center text-xs">
                    No banner uploaded
                  </span>
                </div>
              )}
            </div>
          </div>

          <Dropdown
            label="CTA Button Text"
            value={form.ctaText}
            options={["Shop Now", "Grab Deal", "Explore"]}
            onChange={(val) => handleChange("ctaText", val.target.value)}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="5"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Minimum Purchase</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
              value={form.minPurchase}
              onChange={(e) => handleChange("minPurchase", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Schedule Duration</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                value={form.fromDate}
                onChange={(e) => handleChange("fromDate", e.target.value)}
              />
              <input
                type="date"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371] cursor-pointer"
                value={form.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-4 mt-6">
        <Link
          to={"/deals-discounts"}
          className="px-4 py-2 text-sm bg-white border border-black text-black rounded"
        >
          <VscEye className="inline" size={18} /> Preview Ad
        </Link>
        <Link
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-black text-white rounded"
        >
          <RxBookmark className="inline" size={18} /> Save & Publish
        </Link>
      </div>
    </div>
  );
};

export default CreateDealForm;
