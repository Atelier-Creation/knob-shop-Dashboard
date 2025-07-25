import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Upload,
  Plus,
  X,
  Trash2,
  BadgePlus,
  Fingerprint,
  CreditCard,
  KeyRound,
  Smartphone,
  Joystick,
} from "lucide-react";
import namer from "color-namer";
import ImageUploader from "./ImageUploader";

const ICON_OPTIONS = [
  { label: "finger Print", icon: Fingerprint },
  { label: "Card", icon: CreditCard },
  { label: "Key", icon: KeyRound },
  { label: "App", icon: Smartphone },
  { label: "Remote", icon: Joystick },
];

const getSuggestedName = (hex) => {
  const name = namer(hex).ntc[0]?.name || "Custom Color";
  return name === "Grey" ? "Custom Color" : name;
};

const ProductInfoForm = forwardRef((props, ref) => {
  const [productData, setProductData] = useState({
    name: "",
    categoryId: "",
    categoryName: "",
  });
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [balanceStock, setBalanceStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [colors, setColors] = useState([
    {
      hex: "#f0b501",
      name: getSuggestedName("#f0b501"),
      price: null,
      image: "",
      images: [],
    },
  ]);
  const [picker, setPicker] = useState("#000000");

  const [features, setFeatures] = useState([]);
  const [featInput, setFeatInput] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [desc, setDesc] = useState("");

  const syncName = (v) => setProductName(v);

  useEffect(() => {
    const storedId = localStorage.getItem("selectedCategoryId");
    const storedName = localStorage.getItem("selectedCategoryName");

    if (storedId && storedName) {
      setProductData((prev) => ({
        ...prev,
        categoryId: storedId,
        categoryName: storedName,
      }));
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      name: productName,
      brand,
      categoryId: productData.categoryId,
      categoryName: productData.categoryName,
      price: offerPrice,
      stock: balanceStock,
      discount,
      colors,
      features,
      description: desc,
    }),
  }));

  const addColor = () => {
    if (!colors.find((c) => c.hex === picker)) {
      const newColor = {
        hex: picker,
        name: getSuggestedName(picker),
        price: null,
        image: "",
        images: [],
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

  const addFeature = () => {
    const value = featInput.trim();
    if (!value || features.some((f) => f.label === value)) return;

    setFeatures([
      ...features,
      { label: value, icon: selectedIcon?.icon || BadgePlus },
    ]);
    setFeatInput("");
    setSelectedIcon(null);
  };

  const delFeature = (label) =>
    setFeatures(features.filter((f) => f.label !== label));

  const importTxt = (e) => {
    const file = e.target.files[0];
    if (file?.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (ev) => setDesc(ev.target.result);
      reader.readAsText(file);
    } else {
      alert("Upload .txt only");
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white border border-[#DADADA] rounded-lg p-4 text-[13px] space-y-4">
      <Field label="Product Name" value={productName} set={syncName} placeholder="Enter product name" />
      <Field label="Brand" value={brand} set={setBrand} placeholder="Enter brand" />
      {productData.categoryName && (
        <Field
          label="Category"
          value={productData.categoryName}
          placeholder="Auto-generated from product name"
          readOnly
          extra="bg-gray-100 cursor-not-allowed"
        />
      )}

      <Section title="Price & Stock" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Offer Price" value={offerPrice} set={setOfferPrice} prefix="₹" placeholder="Enter offer price" />
        <Field label="Balance Stock" value={balanceStock} set={setBalanceStock} placeholder="Enter stock count" />
      </div>
      <Field label="Discount" value={discount} set={setDiscount} suffix="%" placeholder="Enter discount %" />

      {/* Color Picker */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-medium">Colors</h4>
        <div className="flex flex-row items-center justify-end gap-2 w-full sm:w-auto">
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
            className="flex items-center gap-1 text-xs rounded-sm border border-gray-100 bg-white px-3 py-2 hover:bg-gray-50"
          >
            <img src="/color-pic-icon.svg" alt="color" height="10" width="18" />
            Add Color
          </button>
        </div>
      </div>

      {/* Color Cards */}
      <div className="flex flex-wrap gap-3 w-full">
        {colors.map((c) => (
          <div key={c.hex} className="flex flex-col gap-2 border border-gray-300 p-3 rounded-md w-full sm:w-[230px]">
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
                title="Remove Color"
                className="text-red-500 text-xs cursor-pointer hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label>Variant Name</label>
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateColor(c.hex, { name: e.target.value })}
                placeholder="Enter Color Name"
                className="border border-gray-300 px-2 py-1 rounded text-xs w-full"
              />
              <p className="text-[11px] italic text-gray-500">
                Suggested: {getSuggestedName(c.hex)}
              </p>

              <label>Price ₹</label>
              <input
                type="number"
                value={c.price}
                min="0"
                onChange={(e) => updateColor(c.hex, { price: Number(e.target.value) })}
                placeholder="Enter Price"
                className="border border-gray-300 px-2 py-1 rounded text-xs w-full"
              />

              <label>Upload Image</label>
              <ImageUploader
                image={c.image}
                onImageUpload={(base64Image) => updateColor(c.hex, { image: base64Image })}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Add image before color and use Eye Picker to pick exact color
      </p>

      <Section title="Features" />
      <div className="flex flex-row mt-4 sm:flex-row gap-2 items-start sm:items-center">
        <div className="flex flex-col gap-1 items-center cursor-pointer" title="Pick Icon">
          <button
            onClick={() => setShowModal(true)}
            className="border border-gray-300 p-1.5 rounded-full bg-gray-200 hover:bg-gray-100"
          >
            {selectedIcon ? React.createElement(selectedIcon.icon, { size: 14 }) : <BadgePlus size={14} />}
          </button>
          <p className="text-xs text-gray-500">{selectedIcon ? selectedIcon.label : "Add icon"}</p>
        </div>

        <input
          value={featInput}
          onChange={(e) => setFeatInput(e.target.value)}
          placeholder="Name of Features"
          className="flex-1 border border-gray-300 rounded-md px-2 py-[10px]"
        />
        <button
          onClick={addFeature}
          className="p-3 bg-[#0c0c0c] text-white rounded-sm"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.map(({ label, icon }) => (
          <ChipFeature key={label} text={label} Icon={icon} del={() => delFeature(label)} />
        ))}
      </div>

      <Section
        title="Description"
        action={
          <label className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer">
            <Upload size={12} /> Upload .txt file
            <input type="file" accept=".txt" hidden onChange={importTxt} />
          </label>
        }
      />
      <textarea
        rows={5}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Upload .txt file or Add Description"
        className="w-full border mt-4 border-gray-300 rounded-md px-3 py-2 resize-none"
      />

      {showModal && (
        <IconPickerModal
          onSelect={(item) => setSelectedIcon(item)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
});

export default ProductInfoForm;

// Helper Components
const Field = ({ label, value, set, readOnly, prefix, suffix, extra = "", placeholder }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-2.5 top-[11px] font-bold">{prefix}</span>}
      <input
        value={value}
        readOnly={readOnly}
        placeholder={placeholder || label}
        onChange={(e) => set?.(e.target.value)}
        className={`w-full border border-gray-300 rounded-md px-3 py-[10px] ${
          prefix ? "pl-6" : ""
        } ${suffix ? "pr-6" : ""} ${extra}`}
      />
      {suffix && <span className="absolute right-2.5 top-[11px] font-bold">{suffix}</span>}
    </div>
  </div>
);

const Section = ({ title, action }) => (
  <>
    <hr className="border-t border-dashed border-gray-300" />
    <div className="flex justify-between items-center mt-2 mb-1">
      <h4 className="font-medium">{title}</h4>
      {action}
    </div>
  </>
);

const ChipFeature = ({ text, del, Icon = BadgePlus }) => (
  <div className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1">
    <Icon size={14} />
    <span>{text}</span>
    <button onClick={del} className="ml-auto text-gray-500 hover:text-red-600">
      <Trash2 size={12} />
    </button>
  </div>
);

const IconPickerModal = ({ onSelect, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 bg-white rounded-full shadow border p-1"
      >
        <X />
      </button>
      <h3 className="text-center font-semibold text-lg mb-4">Icons for Features</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 bg-gray-100 p-4 rounded-lg">
        {ICON_OPTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => {
              onSelect({ label, icon: Icon });
              onClose();
            }}
            className="flex flex-col items-center justify-center text-sm text-gray-700 hover:text-[#783904]"
          >
            <Icon size={28} />
            <span className="text-xs mt-2">{label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);
