import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "./ImageUploader";

function CarouselAdmin() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({
    image: "",
    subtit: "",
    title: "",
    description: "",
  });

  // Fetch existing slides
  useEffect(() => {
    axios.get("/api/carousel").then((res) => setSlides(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/carousel", form);
    const { data } = await axios.get("/api/carousel");
    setSlides(data);
    setForm({
      image: "",
      subtit: "",
      title: "",
      description: "",
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/carousel/${id}`);
    setSlides(slides.filter((s) => s._id !== id));
  };

  return (
    <div className="bg-white p-4 rounded-sm">
      <h2 className="text-xl font-bold my-4">Manage Carousel</h2>

      {/* Add new slide form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 mb-6  w-full"
      >
        {/* Image Uploader */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Slide Image
          </label>
          <ImageUploader
            image={form.image}
            onImageUpload={(url) => setForm({ ...form, image: url })}
            multiple={false}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            type="text"
            name="subtit"
            value={form.subtit}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
          />
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e0a371]"
            rows="6"
          />
        </div>

        {/* Submit */}
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-black/95 hover:bg-black/85 text-white font-medium px-6 py-2 rounded-md shadow-sm transition-colors"
          >
            Add Slide
          </button>
        </div>
      </form>

      {/* Slides list */}
      <div className="grid gap-4">
        {slides?.map((s) => (
          <div
            key={s._id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.subtit}</p>
              <p>{s.description}</p>
            </div>
            <button
              onClick={() => handleDelete(s._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarouselAdmin;
