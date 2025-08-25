import React, { useState, useEffect } from "react";
import { getAllBrochures, editBrochure, deleteBrochure } from "../../api/brochureApi";
import { Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import './Brochure.css'

// Configure DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "us-east-1", // This value doesn't matter for DO, but is required
  credentials: {
    accessKeyId: import.meta.env.VITE_DO_SPACES_KEY,
    secretAccessKey: import.meta.env.VITE_DO_SPACES_SECRET,
  },
});

// Upload function provided by the user
async function uploadToSpaces(file, setUploading) {
  if (!file) return null;

  setUploading(true);
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
    const publicUrl = `https://${bucketName}.blr1.digitaloceanspaces.com/${fileKey}`;
    toast.success("Brochure Uploaded Successfully!");
    return publicUrl;
  } catch (err) {
    console.error("Error uploading to Spaces:", err);
    toast.error("❌ Failed to upload to DigitalOcean Spaces.");
    return null;
  } finally {
    setUploading(false);
  }
}


function BrochureList() {
  const [brochures, setBrochures] = useState([]);
  const [filteredBrochures, setFilteredBrochures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrochure, setEditingBrochure] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getAllBrochures();
      const allBrochures = res.brochures || [];
      setBrochures(allBrochures);
      const uniqueCategories = [
        "All",
        ...new Set(allBrochures.map((b) => b.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching brochures:", err);
      toast.error("Failed to load brochures.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let temp = [...brochures];
    if (searchTerm.trim() !== "") {
      temp = temp.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      temp = temp.filter((item) => item.category === selectedCategory);
    }

    if (sortOption === "title") {
      temp.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "category") {
      temp.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === "newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredBrochures(temp);
  }, [searchTerm, selectedCategory, brochures, sortOption]);

  const handleSort = (option) => {
    setSortOption(option);
    setSortVisible(false);
  };

  const handleDelete = async (brochureId) => {
    if (window.confirm("Are you sure you want to delete this brochure?")) {
      try {
        await deleteBrochure(brochureId);
        toast.success("Brochure deleted successfully!");
        setBrochures(brochures.filter((b) => b._id !== brochureId));
      } catch (err) {
        console.error("Error deleting brochure:", err);
        toast.error("Failed to delete brochure.");
      }
    }
  };

  const openEditModal = (brochure) => {
    setEditingBrochure(brochure);
    setIsModalOpen(true);
    setSelectedFile(null);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingBrochure({ ...editingBrochure, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let brochureData = {
        title: editingBrochure.title,
        category: editingBrochure.category,
      };

      if (selectedFile) {
        const newPdfLink = await uploadToSpaces(selectedFile, setIsUploading);
        if (newPdfLink) {
          brochureData.pdfLink = newPdfLink;
        } else {
          // Stop if upload failed
          return;
        }
      }
      
      await editBrochure(editingBrochure._id, brochureData);
      toast.success("Brochure updated successfully!");
      fetchData();
      setIsModalOpen(false);
      setEditingBrochure(null);
    } catch (err) {
      console.error("Error updating brochure:", err);
      toast.error("Failed to update brochure.");
    }
  };

  return (
    <div className="broucher-con">
      <h2 className="font-semibold text-xl mb-4">Brochure List</h2>
      <div className="brouche-search-filter-con">
        <div className="broucher-search-box-icon">
          <input
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>
        <div className="choose-category-wrapper" title="Sort Options">
          <button
            className="choose-category-button"
            onClick={() => setSortVisible(!sortVisible)}
          >
            Sort By
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`lucide lucide-chevron-down ml-2 transition-transform ${
                sortVisible ? "rotate-180" : ""
              }`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {sortVisible && (
            <div className="broucher-sort-dropdown">
              <div onClick={() => handleSort("title")}>Name (A-Z)</div>
              <div onClick={() => handleSort("category")}>Category (A-Z)</div>
              <div onClick={() => handleSort("newest")}>Newest First</div>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mt-10">
        {filteredBrochures.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-lg border border-gray-300 bg-white shadow-md overflow-hidden"
          >
            <div className="w-full h-64 overflow-hidden">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  item.pdfLink
                )}&embedded=true`}
                title={`Brochure for ${item.title}`}
                className="w-full h-full"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Category: {item.category}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Brochure</h2>
            {editingBrochure?.pdfLink && (
              <div>
                <h3 className="font-medium mb-2">Current Brochure Preview:</h3>
                <div className="w-full h-64 overflow-hidden mb-4 rounded-lg border border-gray-300">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      editingBrochure.pdfLink
                    )}&embedded=true`}
                    title="Current Brochure Preview"
                    className="w-full h-full"
                    frameBorder="0"
                  ></iframe>
                </div>
              </div>
            )}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Brochure Name</label>
                <input
                  type="text"
                  name="title"
                  value={editingBrochure?.title || ""}
                  onChange={handleModalChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Brochure Category</label>
                <input
                  type="text"
                  name="category"
                  value={editingBrochure?.category || ""}
                  onChange={handleModalChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">New Brochure File (Optional)</label>
                <input
                  type="file"
                  name="pdfFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrochureList;