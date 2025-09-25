import React, { useState, useRef } from "react";
import ImageUploader from "./ImageUploader";
import { updateEssentials } from "../api/essentialApi";
import { PencilLine, Trash2 } from "lucide-react";

function CarouselAdmin({ essentials, setEssentials, cardIndex }) {
  const [form, setForm] = useState({
    image: "",
    subtit: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const formRef = useRef(null); // ✅ reference to form

  const card = essentials?.cards?.[cardIndex];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!essentials) return;

    const updatedEssentials = { ...essentials };
    const targetCard = { ...updatedEssentials.cards[cardIndex] };

    if (selectedSlide) {
      targetCard.sliders = targetCard.sliders.map((s) =>
        s._id === selectedSlide._id ? { ...selectedSlide, ...form } : s
      );
    } else {
      targetCard.sliders = [
        ...(targetCard.sliders || []),
        { ...form, _id: Date.now().toString() },
      ];
    }

    updatedEssentials.cards[cardIndex] = targetCard;

    try {
      setLoading(true);
      await updateEssentials(essentials._id, updatedEssentials);
      setEssentials(updatedEssentials);
      setForm({ image: "", subtit: "", title: "", description: "" });
      setSelectedSlide(null);
    } catch (err) {
      console.error("Failed to update sliders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!essentials) return;
    const updatedEssentials = { ...essentials };
    const targetCard = { ...updatedEssentials.cards[cardIndex] };

    targetCard.sliders = targetCard.sliders.filter((s) => s._id !== id);
    updatedEssentials.cards[cardIndex] = targetCard;

    try {
      await updateEssentials(essentials._id, updatedEssentials);
      setEssentials(updatedEssentials);
    } catch (err) {
      console.error("Failed to delete slider:", err);
    }
  };

  const handleEdit = (slide) => {
    setForm({
      image: slide.image,
      subtit: slide.subtit,
      title: slide.title,
      description: slide.description,
    });
    setSelectedSlide(slide);

    // ✅ Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="bg-white p-4 rounded-sm">
      <h2 className="text-xl font-bold my-4" ref={formRef}>
        Manage Carousel for {card?.title}
      </h2>

      {/* Form */}
      <form
         // ✅ attach ref here
        onSubmit={handleSubmit}
        className="grid gap-4 mb-6 w-full"
      >
        <ImageUploader
          image={form.image}
          onImageUpload={(url) => setForm({ ...form, image: url })}
          multiple={false}
        />
        <div className="flex gap-2 flex-wrap lg:flex-nowrap">
          <input
            type="text"
            name="subtit"
            placeholder="Subtitle"
            value={form.subtit}
            onChange={handleChange}
            className="border border-gray-200 w-[50%] px-2 py-2 rounded"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border border-gray-200 w-[50%] px-2 py-2 rounded"
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border border-gray-200 px-2 py-1 rounded h-30"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-black"
            }`}
          >
            {loading
              ? selectedSlide
                ? "Updating..."
                : "Adding..."
              : selectedSlide
              ? "Update Slide"
              : "Add Slide"}
          </button>

          {selectedSlide && (
            <button
              type="button"
              onClick={() => {
                setForm({ image: "", subtit: "", title: "", description: "" });
                setSelectedSlide(null);
              }}
              className="px-4 py-2 rounded bg-gray-400 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="grid gap-4">
        {card?.sliders?.map((s, index) => (
          <div
            key={s._id}
            className="border border-gray-200 p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-xs">Slide {index + 1}</p>
              <div className="flex">
                <div className="border border-gray-200 me-3 mt-1">
                  <img src={s.image} alt={s.title} className="h-20 w-auto" />
                </div>
                <div className="content">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm">{s.subtit}</p>
                  <p>{s.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(s)}
                className="bg-blue-500 flex gap-2 items-center text-white px-2 py-1 rounded"
              >
              <PencilLine size={14}/>  Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 flex gap-2 items-center text-white px-2 py-1 rounded"
              >
              <Trash2 size={14}/>  Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarouselAdmin;
