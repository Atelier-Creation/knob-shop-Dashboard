import { useState } from "react";
import { Upload } from "lucide-react";

const ProductInfoForm = () => {
  const [productName, setProductName] = useState("YDME50NxT Smart Door Lock");
  const [category, setCategory] = useState("YDME50NxT Smart Door Lock");
  const [description, setDescription] = useState("");

  const handleProductNameChange = (e) => {
    const value = e.target.value;
    setProductName(value);
    setCategory(value); // sync with category
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDescription(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file only");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-md w-full">
      {/* Product Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          value={productName}
          onChange={handleProductNameChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          value={category}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 cursor-not-allowed"
        />
      </div>

      {/* Business Description + Upload */}
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Business Description
        </label>
        <label className="text-sm text-blue-600 cursor-pointer flex items-center gap-1">
          <Upload size={14} />
          <input
            type="file"
            accept=".txt"
            className="hidden"
            onChange={handleFileUpload}
          />
          Upload .txt file
        </label>
      </div>
      <textarea
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
};

export default ProductInfoForm;
