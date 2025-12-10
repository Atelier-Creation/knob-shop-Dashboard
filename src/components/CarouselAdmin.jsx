import React, { useState, useRef } from "react";
import ImageUploader from "./ImageUploader";
// import { updateCardInEssentials } from "../api/essentialApi";
import { PencilLine, Trash2 } from "lucide-react";

function CarouselAdmin({ sliders, cardTitle, onSliderChange }) {
  const [form, setForm] = useState({
    image: "",
    subtit: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const formRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ image: "", subtit: "", title: "", description: "" });
    setSelectedSlide(null);
  };

  /** --------------------------
   * ADD OR EDIT SLIDE
   * --------------------------- */
const handleSubmit = (e) => {
  setLoading(true);
    e.preventDefault();

    let newSlides;

    if (selectedSlide) {
      newSlides = sliders.map((s) =>
        s._id === selectedSlide._id ? { ...s, ...form } : s
      );
    } else {
      newSlides = [...sliders, { ...form }];
    }

    onSliderChange(newSlides);
    setForm({ image: "", subtit: "", title: "", description: "" });
    setSelectedSlide(null);
    setLoading(false);
  };

  const handleDelete = (id) => {
    const newSlides = sliders.filter((s) => s._id !== id);
    onSliderChange(newSlides);
  };

  const handleEdit = (slide) => {
    setForm(slide);
    setSelectedSlide(slide);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white p-4 rounded-sm">
      <h2 className="text-xl font-bold my-4" ref={formRef}>
        Manage Carousel for {cardTitle}
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-4 mb-6 w-full">
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
          className="border border-gray-200 px-2 py-2 rounded h-30"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-500" : "bg-black"
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
              onClick={resetForm}
              className="px-4 py-2 rounded bg-gray-400 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {sliders?.map((s, index) => (
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
                <PencilLine size={14} /> Edit
              </button>

              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 flex gap-2 items-center text-white px-2 py-1 rounded"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarouselAdmin;
