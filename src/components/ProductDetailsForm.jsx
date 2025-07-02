import { useRef, useState } from "react";
import { Film, ImagePlus, Plus, Save, X } from "lucide-react";

const ProductDetailsForm = () => {
  const productImageInput = useRef(null);
  const featureImageInput = useRef(null);

  const [productImages, setProductImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({
    subheading: "",
    description: "",
    image: null,
  });

  const [techSpecs, setTechSpecs] = useState([]);
  const [newSpec, setNewSpec] = useState({ heading: "", description: "" });

  const handleAddSpec = () => {
    if (!newSpec.heading.trim() || !newSpec.description.trim()) return;
    setTechSpecs((prev) => [
      ...prev,
      { ...newSpec, id: Date.now().toString() },
    ]);
    setNewSpec({ heading: "", description: "" });
  };

  const handleUpload = (e, setState) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    setState((prev) => [...prev, ...previews]);
  };

  const handleDrop = (e, setState) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const previews = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    setState((prev) => [...prev, ...previews]);
  };

  const removeImage = (id, setState) => {
    setState((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSaveFeature = () => {
    if (!newFeature.subheading || !newFeature.description || !newFeature.image)
      return;

    const newFeatureEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...newFeature,
    };

    setFeatures((prev) => [...prev, newFeatureEntry]);
    setNewFeature({ subheading: "", description: "", image: null });
  };

  return (
    <div className="w-full md:w-1/2 p-4 sm:p-6 bg-white rounded-xl space-y-8 border border-gray-200">
      {/* Product Images */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Product Images
        </h3>
        <div
          onClick={() => productImageInput.current.click()}
          onDrop={(e) => handleDrop(e, setProductImages)}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-blue-200 p-6 rounded-lg text-center cursor-pointer mb-4 hover:border-blue-400"
        >
          <div className="flex flex-col items-center gap-2 justify-center text-sm text-gray-600">
            <div className="flex items-center gap-1 text-gray-800 mb-1 ">
              <ImagePlus size={28} className="inline-block" />{" "}
              <Plus size={20} className="inline-block" />{" "}
              <Film size={28} className="inline-block" />
            </div>
            <span className="text-blue-400 underline">Click to Upload</span>
            <span className="text-xs text-gray-400 mt-1">or Drag & Drop</span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={productImageInput}
            className="hidden"
            onChange={(e) => handleUpload(e, setProductImages)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {productImages.map((img) => (
            <div
              key={img.id}
              className="relative w-20 h-20 border border-gray-400 rounded overflow-visible"
            >
              <img
                src={img.url}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <button
                onClick={() => removeImage(img.id, setProductImages)}
                className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-[2px] shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Product Features */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Product Features
          </h3>
          <button
            type="button"
            className="bg-black text-white px-3 py-1.5 rounded-md text-sm"
            onClick={handleSaveFeature}
            disabled={
              !newFeature.subheading ||
              !newFeature.description ||
              !newFeature.image
            }
          >
            Add
          </button>
        </div>

        {/* Feature Input Form */}
        <div className="p-2 rounded-md space-y-3 sm:space-y-4">
          {/* Upload */}
          <div
            onClick={() => featureImageInput.current.click()}
            onDrop={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-blue-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-400"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={featureImageInput}
              onChange={(e) => {
                if (e.target.files.length) {
                  const file = e.target.files[0];
                  setNewFeature((prev) => ({
                    ...prev,
                    image: {
                      file,
                      url: URL.createObjectURL(file),
                    },
                  }));
                }
              }}
            />
            {newFeature.image ? (
              <img
                src={newFeature.image.url}
                alt="feature"
                className="w-20 h-20 mx-auto object-cover rounded-md"
              />
            ) : (
              <div className="text-sm text-gray-600">
                <ImagePlus size={24} className="mx-auto mb-1" />
                <p className="text-blue-500 underline">Click to Upload</p>
                <p className="text-xs text-gray-400">or Drag & Drop</p>
              </div>
            )}
          </div>

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Sub Heading"
            value={newFeature.subheading}
            onChange={(e) =>
              setNewFeature((prev) => ({ ...prev, subheading: e.target.value }))
            }
            className="w-full border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
          />
          <textarea
            placeholder="Add Description"
            value={newFeature.description}
            onChange={(e) =>
              setNewFeature((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm resize-none"
          />
        </div>

        {/* Saved Features Display */}
        <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-md bg-white p-3 shadow text-center"
            >
              <img
                src={feature.image.url}
                alt={feature.subheading}
                className="w-full h-30 object-cover rounded-md mb-3"
              />
              <h4 className="font-semibold text-sm text-gray-800 mb-1">
                {feature.subheading}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Specification */}
      <section className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Technical Specification
          </h3>
          <button
            onClick={handleAddSpec}
            className="flex items-center gap-1 text-sm text-white bg-black px-3 py-1.5 rounded-md"
          >
            Add
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Add Sub Heading"
            value={newSpec.heading}
            onChange={(e) =>
              setNewSpec((prev) => ({ ...prev, heading: e.target.value }))
            }
            className="w-full border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm"
          />
          <textarea
            placeholder="Add Description"
            value={newSpec.description}
            onChange={(e) =>
              setNewSpec((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full border border-gray-300 focus:ring-2 focus:ring-[#e0a371] outline-0 px-3 py-2 rounded-md text-sm resize-none"
          />
        </div>

        {/* Added Specs Display */}
        <div className="flex flex-wrap gap-2">
          {techSpecs.map((spec) => (
            <div
              key={spec.id}
              className="flex gap-2 m-0 w-fit flex-wrap items-center border border-gray-300 px-2 py-2 rounded-md bg-white shadow"
            >
              <span className="font-semibold text-sm text-gray-800">
                {spec.heading}
              </span>
              :
              <span className="text-sm text-gray-600">{spec.description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsForm;
