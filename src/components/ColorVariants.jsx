import React, { useRef, useState, useEffect, useCallback } from "react";
import ColorNamer from "color-namer";
import { Plus, Trash2, X } from "lucide-react"; // Changed Trash2 to X for image delete button
import toast from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ColorVariants = ({ colors = [], setColors }) => {
  const inputRef = useRef(null);
  const inlineColorInputRefs = useRef({});
  const [picker, setPicker] = useState("#f1c40f");

  const getSuggestedName = (hex) => {
    try {
      const names = ColorNamer(hex);
      return names?.ntc?.[0]?.name || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const handleImageDragEnd = (result, colorIndex) => {
    if (!result.destination) return;

    const updatedColors = [...colors];
    const items = Array.from(updatedColors[colorIndex].images);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    updatedColors[colorIndex].images = items;

    setColors(updatedColors);
  };

  const addColor = () => {
    if (colors.find((c) => c.hex.toLowerCase() === picker.toLowerCase())) {
      toast.error("This color already exists!");
      return;
    }

    const newColor = {
      hex: picker,
      name: getSuggestedName(picker),
      images: [],
      sizes: [
        {
          label: "",
          mrp: null,
          discountPercentage: null,
          taxPercentage: null,
          sellingPrice: null,
          stock: null,
        },
      ],
    };
    setColors([...colors, newColor]);
  };

  const removeColor = (hex) => {
    setColors(colors.filter((c) => c.hex !== hex));
  };

  const updateColor = (oldHex, updatedFields) => {
    setColors((prev) =>
      prev.map((c) => (c.hex === oldHex ? { ...c, ...updatedFields } : c))
    );
  };

  const handleVariantImagesAdded = (uploadedImagesData, hex) => {
    setColors((prev) =>
      prev.map((c) =>
        c.hex === hex
          ? { ...c, images: [...c.images, ...uploadedImagesData] }
          : c
      )
    );
  };

  const removeVariantImage = (hex, imageIndex) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.hex === hex) {
          const updatedImages = [...c.images];
          const [removedImage] = updatedImages.splice(imageIndex, 1);

          if (removedImage && removedImage.deleteToken) {
            const cloudName =
              import.meta.env.VITE_CLOUDINARY_NAME || "dpea4iv0b";
            fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: removedImage.deleteToken }),
              }
            )
              .then((response) => {
                if (response.ok) {
                  toast.success("Variant image removed from Cloudinary.");
                } else {
                  response
                    .json()
                    .then((errorData) => {
                      console.error(
                        "Failed to remove variant image from Cloudinary:",
                        errorData
                      );
                      toast.error(
                        "Failed to remove variant image from Cloudinary."
                      );
                    })
                    .catch(() => {
                      console.error(
                        "Failed to remove variant image from Cloudinary. No JSON response."
                      );
                      toast.error(
                        "Failed to remove variant image from Cloudinary."
                      );
                    });
                }
              })
              .catch((err) => {
                console.error("Error calling Cloudinary delete API:", err);
                toast.error("Error during Cloudinary image removal.");
              });
          }

          return { ...c, images: updatedImages };
        }
        return c;
      })
    );
  };

  const addSizeToColor = (hex) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.hex === hex) {
          return {
            ...c,
            sizes: [
              ...(c.sizes || []),
              {
                label: "",
                mrp: null,
                discountPercentage: null,
                taxPercentage: null,
                sellingPrice: null,
                stock: null,
              },
            ],
          };
        }
        return c;
      })
    );
  };

  const updateSize = (hex, index, field, value) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.hex === hex) {
          const sizes = [...(c.sizes || [])];
          const newValue = field === "label" ? value.toUpperCase() : value;

          if (field === "label") {
            const duplicate = sizes.some(
              (s, i) =>
                i !== index && s.label.toLowerCase() === newValue.toLowerCase()
            );
            if (duplicate && newValue !== "") {
              toast.error(`Size "${newValue}" already exists for this color`, {
                id: `duplicate-size-${hex}-${newValue}`,
              });
              return c;
            }
          }

          sizes[index] = { ...sizes[index], [field]: newValue };
          return { ...c, sizes };
        }
        return c;
      })
    );
  };

  const removeSizeFromColor = (hex, index) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.hex === hex) {
          const sizes = [...(c.sizes || [])];
          sizes.splice(index, 1);
          return { ...c, sizes };
        }
        return c;
      })
    );
  };

  const handleInlineColorChange = (oldHex, newHex) => {
    const existing = colors.find(
      (c) => c.hex?.toLowerCase() === newHex?.toLowerCase()
    );
    if (existing && existing.hex !== oldHex) {
      toast.error("This color already exists", { id: `duplicate-color-hex` });
      return;
    }

    updateColor(oldHex, { hex: newHex, name: getSuggestedName(newHex) });
  };

  const calculateSellingPrice = useCallback((mrp, discount, tax) => {
    const numMrp = Number(mrp) || 0;
    const numDiscount = Number(discount) || 0;
    const numTax = Number(tax) || 0;

    const discountedPrice = numMrp * (1 - numDiscount / 100);
    const finalSellingPrice = discountedPrice * (1 + numTax / 100);
    return parseFloat(finalSellingPrice.toFixed(2));
  }, []);

  useEffect(() => {
    setColors((prevColors) => {
      let changed = false;
      const newColors = prevColors.map((color) => {
        const newSizes = color.sizes.map((size) => {
          const currentSellingPrice = size.sellingPrice;
          const calculatedSellingPrice = calculateSellingPrice(
            size.mrp,
            size.discountPercentage,
            size.taxPercentage
          );

          if (currentSellingPrice !== calculatedSellingPrice) {
            changed = true;
            return { ...size, sellingPrice: calculatedSellingPrice };
          }
          return size;
        });
        if (changed) {
          return { ...color, sizes: newSizes };
        }
        return color;
      });
      return changed ? newColors : prevColors;
    });
  }, [colors, calculateSellingPrice]);

  console.log(colors);

  return (
    <div className="mt-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Color Variants
      </label>

      <div className="flex items-center justify-end space-x-4 mb-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="color"
            value={picker}
            onChange={(e) => setPicker(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div
            className="w-12 h-8 border-2 border-white rounded-full cursor-pointer"
            style={{ backgroundColor: picker }}
            onClick={() => {
              inputRef.current?.click();
            }}
          ></div>
        </div>
        <button
          type="button"
          onClick={addColor}
          className="bg-gray-800 text-white text-xs px-3 py-2 rounded flex items-center gap-2"
        >
          <img src="/color-pic-icon.svg" alt="Color wheel" /> Add Color
        </button>
      </div>

      <div className="space-y-6">
        {colors.map((c, colorIndex) => (
          <div
           key={`${c.hex}-${colorIndex}`}
            className="p-4 border border-gray-300 bg-white rounded-md shadow-sm relative max-w-[950px]"
          >
            <button
              type="button"
              onClick={() => removeColor(c.hex)}
              className="absolute top-4 right-4 bg-gray-200 p-1.5 rounded-full text-red-500 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>

            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) =>
                    handleInlineColorChange(c.hex, e.target.value)
                  }
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  ref={(el) => (inlineColorInputRefs.current[c.hex] = el)}
                />
                <div className="flex items-center gap-2">
                  <div
                    className="w-14 h-8 border-2 border-gray-300 rounded-full cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => {
                      inlineColorInputRefs.current[c.hex]?.click();
                    }}
                  ></div>
                  <span className="text-xs text-gray-400">{c.hex}</span>
                </div>
              </div>
            </div>
            <input
              type="text"
              value={c.name}
              onChange={(e) => updateColor(c.hex, { name: e.target.value })}
              placeholder="Metalic Silver"
              className={`border border-gray-300 focus:ring-0 outline-0 px-2 py-3 rounded text-xs w-full ${
                c.name || "mb-3"
              }`}
            />
            {c.name && (
              <p className="text-[10px] mb-3 mt-1 text-gray-500">
                Above filled name is Suggest name you can change it.
              </p>
            )}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Upload Variant Images
              </label>
              <ImageUploader
                multiple={true}
                onImageUpload={(uploadedImagesData) =>
                  handleVariantImagesAdded(uploadedImagesData, c.hex)
                }
              />
            </div>

            {/* CORRECTED SECTION: Render images for the current color variant 'c' */}
            {c.images && c.images.length > 0 && (
              <DragDropContext
                onDragEnd={(result) => handleImageDragEnd(result, colorIndex)}
              >
                <Droppable
                  droppableId={`droppable-${c.hex}`}
                  direction="horizontal"
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-wrap gap-2 mt-2"
                    >
                      {c.images.map((img, imgIndex) => (
                        <Draggable
                          key={img.url}
                          draggableId={img.url}
                          index={imgIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative ${
                                imgIndex === 0 ? "w-48 h-48" : "w-24 h-24"
                              } border border-gray-400 rounded overflow-hidden`}
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeVariantImage(c.hex, imgIndex)
                                }
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/30 border-2 border-gray-100 flex items-center justify-center text-white/80 hover:bg-red-500 hover:text-white"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            <div className="mt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Sizes
              </label>
              {c.sizes?.map((size, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-md mb-2 bg-white relative"
                >
                  <button
                    type="button"
                    onClick={() => removeSizeFromColor(c.hex, index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={size.label}
                        onChange={(e) =>
                          updateSize(c.hex, index, "label", e.target.value)
                        }
                        placeholder="Label (e.g., 4'' X 4'')"
                        className="border border-gray-300 focus:ring-0 outline-0 px-2 py-2 rounded text-xs w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        MRP Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-[7px] text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={size.mrp ?? ""}
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) =>
                            updateSize(
                              c.hex,
                              index,
                              "mrp",
                              Number(e.target.value)
                            )
                          }
                          placeholder="MRP"
                          className="border border-gray-300 focus:ring-0 outline-0 px-2 py-2 rounded text-xs w-full pl-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        Discount %
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          max={100}
                          min={0}
                          value={size.discountPercentage ?? ""}
                          onWheel={(e) => e.target.blur()}
                          onChange={(e) =>
                            updateSize(
                              c.hex,
                              index,
                              "discountPercentage",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Discount"
                          className="border border-gray-300 focus:ring-0 outline-0 px-2 py-2 rounded text-xs w-full pr-6"
                        />
                        <span className="absolute right-2.5 top-[7px] text-xs font-bold">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        Tax %
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          max={100}
                          min={0}
                          value={size.taxPercentage ?? ""}
                          onChange={(e) =>
                            updateSize(
                              c.hex,
                              index,
                              "taxPercentage",
                              Number(e.target.value)
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                          placeholder="Tax"
                          className="border border-gray-300 focus:ring-0 outline-0 px-2 py-2 rounded text-xs w-full pr-6"
                        />
                        <span className="absolute right-2.5 top-[7px] text-xs font-bold">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        Selling Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-[7px] text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={size.sellingPrice ?? ""}
                          readOnly
                          placeholder="Calculated"
                          className="border border-gray-300 bg-gray-100 cursor-not-allowed focus:ring-0 outline-0 px-2 py-2 rounded text-xs w-full pl-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={size.stock ?? ""}
                        onChange={(e) =>
                          updateSize(
                            c.hex,
                            index,
                            "stock",
                            Number(e.target.value)
                          )
                        }
                        onWheel={(e) => e.target.blur()}
                        placeholder="Stock"
                        className="border border-gray-300 focus:ring-0 outline-0 px-2 py-2 rounded text-xs w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSizeToColor(c.hex)}
                className="text-blue-600 text-xs mt-1 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Size
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorVariants;