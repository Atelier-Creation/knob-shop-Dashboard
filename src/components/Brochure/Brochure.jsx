import { useState, useRef } from "react";
import { createBrochure } from "../../api/brochureApi";
import "./Brochure.css";
import toast from "react-hot-toast";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import BrochureList from "./BroucherList";

const s3 = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_DO_SPACES_KEY,
    secretAccessKey: import.meta.env.VITE_DO_SPACES_SECRET,
  },
});

async function uploadToSpaces(file, setUploading) {
  if (!file) return null;
  setUploading(true);
  const bucketName = "knobsshopcdn";
  const fileKey = `uploads/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

  try {
    const fileBuffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: new Uint8Array(fileBuffer),
      ACL: "public-read",
      ContentType: file.type,
    });

    await s3.send(command);

    // Construct the public URL
    const publicUrl = `https://${bucketName}.blr1.cdn.digitaloceanspaces.com/${fileKey}`;
    return publicUrl;
  } catch (err) {
    console.error("Error uploading to Spaces:", err);
    throw err;
  } finally {
    setUploading(false)
  }
}

function Brochure() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || !file) {
      toast.error("All fields are required");
      return;
    }

    const pdfUrl = await uploadToSpaces(file, setUploading);
    if (!pdfUrl) return;

    const payload = {
      title: name.trim(),
      category: category.trim(),
      pdfLink: pdfUrl,
    };

    try {
      const response = await createBrochure(payload);
      toast.success("Brochure created successfully!");
      console.log("Brochure", response);

      // Reset form
      setName("");
      setCategory("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Trigger list refresh
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error uploading brochure:", error);
      toast.error("❌ Failed to upload brochure to backend.");
    }
  };

  return (
    <>
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

      <BrochureList refreshKey={refreshKey} />
    </>
  );
}

export default Brochure;
