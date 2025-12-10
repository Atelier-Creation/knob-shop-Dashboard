import React, { useState, useEffect } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  getShelves,
  createShelf,
  updateShelf,
  deleteShelf,
} from "../api/shelfApi";
import { PencilLine, Trash2 } from "lucide-react";

const s3 = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "us-east-1", // Required but not used by DO
  credentials: {
    accessKeyId: import.meta.env.VITE_DO_SPACES_KEY,
    secretAccessKey: import.meta.env.VITE_DO_SPACES_SECRET,
  },
});

async function uploadToSpaces(file) {
  if (!file) return null;

  const bucketName = "knobsshopcdn";
  const sanitizedFileName = file.name
    .replace(/\s+/g, "_")      // replace spaces with underscores
    .replace(/[^\w.\-]/g, ""); // remove invalid characters
  const fileKey = `uploads/${Date.now()}-${sanitizedFileName}`;

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

    return `https://${bucketName}.blr1.cdn.digitaloceanspaces.com/${fileKey}`;
  } catch (err) {
    console.error("Error uploading to Spaces:", err);
    throw err;
  }
}

const ShelfManager = () => {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Uploading, setUploading] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);
  const [form, setForm] = useState({ heading: "", content: "" });
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    setLoading(true);
    try {
      const data = await getShelves();
      setShelves(data.data);
    } catch (err) {
      console.error("Error fetching shelves:", err);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingShelf(null);
    setForm({ heading: "", content: "" });
    setFile(null);
  };

  const handleEdit = (shelf) => {
    setEditingShelf(shelf);
    setForm({ heading: shelf.heading, content: shelf.content });
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shelf?")) {
      try {
        await deleteShelf(id);
        fetchShelves();
      } catch (err) {
        console.error("Error deleting shelf:", err);
      }
    }
  };

  // ✅ validate image ratio
  const validateImageRatio = (selectedFile, callback) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        const ratio = img.width / img.height;
        const requiredRatio = 1200 / 400; // 3:1 ratio

        if (Math.abs(ratio - requiredRatio) < 0.01) {
          callback(true);
        } else {
          alert(
            `Invalid image ratio! Required 3:1 (e.g., 1200x400). Got ${img.width}x${img.height}`
          );
          callback(false);
        }
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file" && files.length > 0) {
      const selectedFile = files[0];
      validateImageRatio(selectedFile, (isValid) => {
        if (isValid) setFile(selectedFile);
        else e.target.value = ""; // reset file input
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateImageRatio(droppedFile, (isValid) => {
        if (isValid) setFile(droppedFile);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingShelf?.imageUrl;

      if (file) {
        imageUrl = await uploadToSpaces(file);
      }

      if (editingShelf) {
        await updateShelf(editingShelf._id, { ...form, imageUrl });
      } else {
        await createShelf({ ...form, imageUrl });
      }
    } catch (err) {
      console.error("Error submitting shelf:", err);
    } finally {
      setUploading(false);
    }

    setEditingShelf(null);
    setForm({ heading: "", content: "" });
    setFile(null);
    fetchShelves();
  };
  const ShelfSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-48 bg-gray-300 rounded"></div>
      <div className="flex gap-2">
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};


  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">
          Manage Ad Banner's
        </h1>
        <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-md mb-8">
          <ShelfSkeleton />
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-md">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4  min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Manage Ad Banner's
      </h1>
      <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingShelf ? "Edit Ad" : "Create New Ad"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Heading{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (Heading and content won't display)
                </span>
              </label>
              <input
                type="text"
                name="heading"
                value={form.heading}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Content
              </label>
              <input
                type="text"
                name="content"
                value={form.content}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Image
              </label>
              <div
                className={`flex items-center justify-center w-full h-42 border-2 shadow border-dashed rounded-lg transition-colors ${
                  isDragging
                    ? "border-gray-800 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <p className="text-gray-500">Drag & Drop an image here</p>
                  <p className="text-gray-500 text-xs mt-1">or</p>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-gray-800 hover:text-blue-800"
                  >
                    Click to select a file upload 1200×400 (required)
                  </label>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              {(file || editingShelf?.imageUrl) && (
                <div className="mt-4 p-2 bg-gray-200 rounded-lg">
                  <p className="text-sm font-semibold">Selected Image:</p>
                  {file && (
                    <div className="w-full my-2 m-auto max-w-4xl aspect-[3/1] border rounded overflow-hidden bg-gray-100">
                      <img
                        src={
                          editingShelf?.imageUrl ||
                          (file && URL.createObjectURL(file))
                        }
                        alt="Shelf Preview"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}
                  {editingShelf?.imageUrl && !file && (
                    <p className="text-xs text-gray-700">
                      Current Image:{" "}
                      <div className="w-full my-2 m-auto max-w-4xl aspect-[3/1] border rounded overflow-hidden bg-gray-100">
                        <img
                          src={
                            editingShelf?.imageUrl ||
                            (file && URL.createObjectURL(file))
                          }
                          alt="Shelf Preview"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </p>
                  )}
                  {file && editingShelf?.imageUrl && (
                    <p className="text-xs text-gray-700 mt-1">
                      Old image will be replaced.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {Uploading
                ? editingShelf
                  ? "Saving..."
                  : "Uploading..."
                : editingShelf
                ? "Save Changes"
                : "Create Shelf"}
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="bg-white hover:bg-gray-100 border text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Heading</th>
              <th className="py-3 px-6 text-left">Content</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {shelves?.map((shelf) => (
              <tr
                key={shelf._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {shelf.heading}
                </td>
                <td className="py-3 px-6 text-left">{shelf.content}</td>
                <td className="py-3 px-6 text-center">
                  <img
                    src={shelf.imageUrl}
                    alt={shelf.heading}
                    className="w-46 h-16 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(shelf)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white inline-flex gap-1 font-bold py-2 px-2 rounded text-xs"
                    >
                      <PencilLine size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(shelf._id)}
                      className="bg-red-500 hover:bg-red-600 inline-flex gap-1 text-white font-bold py-2 px-2 rounded text-xs"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShelfManager;
