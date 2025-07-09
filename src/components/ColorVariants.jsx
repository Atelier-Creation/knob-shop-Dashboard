import { useState } from "react";
import { X, Image as ImageIcon, Palette } from "lucide-react";

const ColorVariants = () => {
  const [productData, setProductData] = useState({
    colors: [{ color: "Yellow", code: "#facc15", price: 90000 }],
  });

  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [newPrice, setNewPrice] = useState("");

  const addColor = () => {
    if (!newPrice) return;

    setProductData({
      ...productData,
      colors: [
        ...productData.colors,
        { color: "Custom", code: selectedColor, price: parseInt(newPrice) },
      ],
    });

    setSelectedColor("#ff0000");
    setNewPrice("");
  };

  const removeColor = (index) => {
    const updatedColors = [...productData.colors];
    updatedColors.splice(index, 1);
    setProductData({ ...productData, colors: updatedColors });
  };

  return (
    <div>
      <label className="font-medium mb-1 block">Color Variants & Price</label>
      <div className="flex flex-wrap items-center gap-4">
        {/* Existing colors */}
        {productData.colors.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1 border rounded-full bg-white shadow-sm"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c.code }}
            ></div>
            <span className="text-sm">
              {c.color} – ₹ {c.price.toLocaleString()}
            </span>
            <button onClick={() => removeColor(i)}>
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Color Picker and Add UI */}
        <div className="flex items-center gap-2 border px-3 py-1 rounded bg-white shadow-sm">
          
          <img size={18} src="./color-pic-icon.svg" className="cursor-pointer" />
          <button
            onClick={addColor}
            className="text-gray-600 text-sm font-medium"
          >
            + Add Color & Price
          </button>
        </div>
        <div className=" flex flex-col items-center border px-3 py-1 rounded bg-white shadow-sm">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-38 h-38 rounded-xl bg-none cursor-pointer border-0 p-0 shadow-none"
          />
          <div className="flex items-center">
            <input
            type="number"
            placeholder="Add Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-28 text-sm px-2 py-1 border rounded"
          />
          <ImageIcon size={30} className="text-gray-500 ms-2 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorVariants;
