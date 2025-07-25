import ImageUploader from "./ImageUploader";
import namer from "color-namer";

const getSuggestedName = (hex) => {
  const name = namer(hex).ntc[0]?.name || "Custom Color";
  return name === "Grey" ? "Custom Color" : name;
};

export default function ColorVariants({ colors, setColors, picker, setPicker }) {
  const addColor = () => {
    if (!colors.find((c) => c.hex === picker)) {
      const newColor = {
        hex: picker,
        name: getSuggestedName(picker),
        price: null,
        images: [] 
      };
      setColors([...colors, newColor]);
    }
  };

  const updateColor = (hex, updates) => {
    setColors((prev) =>
      prev.map((c) => (c.hex === hex ? { ...c, ...updates } : c))
    );
  };

  const delColor = (hex) => {
    setColors(colors.filter((c) => c.hex !== hex));
  };

  const handleVariantImageUpload = (imageUrl, colorHex) => {
    setColors(prevColors =>
      prevColors.map(c => {
        if (c.hex === colorHex) {
          return { ...c, images: [...c.images, imageUrl] };
        }
        return c;
      })
    );
  };

  const removeVariantImage = (colorHex, imgUrlToRemove) => {
    setColors(prevColors =>
      prevColors.map(c => {
        if (c.hex === colorHex) {
          return {
            ...c,
            images: c.images.filter(url => url !== imgUrlToRemove)
          };
        }
        return c;
      })
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium">Colors</h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-200 shadow"
              style={{ backgroundColor: picker }}
            >
              <input
                type="color"
                value={picker}
                title="Pick Color"
                onChange={(e) => setPicker(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-xs font-mono">{picker.toUpperCase()}</span>
          </div>
          <button
            onClick={addColor}
            className="flex items-center gap-1 text-xs rounded-sm cursor-pointer border border-gray-100 bg-white px-3 py-2 hover:bg-gray-50"
          >
            <img src="/color-pic-icon.svg" alt="color" height="10" width="18" />
            Add Color
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {colors.map((c) => (
          <div
            key={c.hex}
            className="flex flex-col gap-2 border border-gray-300 p-3 rounded-md w-full sm:w-[230px] bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="relative w-10 h-6 rounded-xl overflow-hidden border-2 border-gray-200 shadow"
                  style={{ backgroundColor: c.hex }}
                >
                  <input
                    type="color"
                    value={c.hex}
                    title="Change Color"
                    onChange={(e) => {
                      const newHex = e.target.value;
                      const newName = getSuggestedName(newHex);
                      updateColor(c.hex, { hex: newHex, name: newName });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-700">
                  Color: <span className="font-semibold">{c.hex}</span>
                </p>
              </div>
              <button
                onClick={() => delColor(c.hex)}
                className="text-red-500 text-xs hover:text-red-700 cursor-pointer"
              >
                Remove
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-xs font-medium text-gray-700">Variant Name</label>
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateColor(c.hex, { name: e.target.value })}
                className="border border-gray-300 px-2 py-2 focus:ring-0 outline-none rounded text-xs w-full"
                placeholder="Enter Color Name"
              />
              <p className="text-[11px] italic text-gray-500">
                Suggested: {getSuggestedName(c.hex)}
              </p>

              <label className="block text-xs font-medium text-gray-700">Price ₹</label>
              <input
                type="number"
                value={c.price || ''} // Use empty string for null/undefined to prevent React warning
                min="0"
                onChange={(e) =>
                  updateColor(c.hex, { price: Number(e.target.value) })
                }
                className="appearance-none border border-gray-300 px-2 py-2 focus:ring-0 outline-none rounded text-xs w-full"
                placeholder="Enter Price"
              />

              <label className="block text-xs font-medium text-gray-700">Upload Images</label>
              <ImageUploader
                onImageUpload={(imageUrl) => handleVariantImageUpload(imageUrl, c.hex)}
              />
              {/* Display uploaded images for this variant */}
              {c.images && c.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {c.images.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="relative w-16 h-16 rounded-md overflow-hidden border shadow-sm">
                      <img src={imgUrl} alt={`Variant ${c.name} Image ${imgIdx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeVariantImage(c.hex, imgUrl)}
                        className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Add image before color and use Eye Picker to pick exact color
      </p>
    </div>
  );
}