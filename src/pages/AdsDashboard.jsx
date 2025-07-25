import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const adData = [
  {
    id: 1,
    title: "Digital Safe Lockers",
    date: "01 Jun–30 Jun 2025",
    category: "Homepage",
    status: "active",
    image: "https://images.pexels.com/photos/845451/pexels-photo-845451.jpeg",
  },
  {
    id: 2,
    title: "Living Room",
    date: "01 Jun–30 Jun 2025",
    category: "Homepage",
    status: "scheduled",
    image: "https://images.pexels.com/photos/1125133/pexels-photo-1125133.jpeg",
  },
  {
    id: 3,
    title: "Cabinets & Storage",
    date: "01 May–31 May 2025",
    category: "Product Page",
    status: "expired",
    image: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-700",
  scheduled: "bg-yellow-100 text-yellow-700",
  expired: "bg-red-100 text-red-700",
};

export default function AdsDashboard() {
  const [selectedAd, setSelectedAd] = useState(adData[0]);

  return (
    <div className="min-h-screen text-gray-800">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Ad Cards */}
        <div className="flex-1">
          <div className="flex flex-col justify-between items-start gap-5 mb-4">
            <h2 className="text-xl font-semibold">Homepage Ads / Overview</h2>
            <Link
              to={"/homepage-ads/create"}
              className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition text-sm"
            >
              + Create New Ad
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adData.map((ad) => (
              <div
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className="bg-white rounded-lg shadow flex flex-col justify-between p-3 hover:shadow-md transition cursor-pointer border border-gray-200"
              >
                <div className="flex">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className=" w-1/2 h-32 object-cover rounded shadow-md"
                  />
                  <div className="w-1/2  flex flex-col justify-between">
                    <div className="flex justify-end">
                      <EllipsisVertical />
                    </div>
                    <h1 className="text-2xl p-3 font-semibold">{ad.title}</h1>
                  </div>
                </div>
                <div className="pt-3 space-y-2">
                  <div
                    className={`inline-block text-xs px-2 py-1 rounded ${
                      statusStyles[ad.status]
                    }`}
                  >
                    {ad.status.toUpperCase()}
                  </div>
                  <p className="text-xs text-gray-500">{ad.date}</p>
                  <p className="text-xs text-gray-400">{ad.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ad Preview */}
        <div className="w-full md:max-w-sm">
        <h4 className="text-lg text-dark font-bold mb-4">Ad Preview </h4>
        <div className="bg-white rounded-xl shadow p-5" style={{ height: "fit-content" }}>
          <img
            src={selectedAd.image}
            alt={selectedAd.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">{selectedAd.title}</h3>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-sm">{selectedAd.date}</p>
            <p className="text-sm text-gray-500">Linked Category</p>
            <p className="text-sm">{selectedAd.category}</p>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Active</label>
              <div className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAd.status === "active"}
                  className="sr-only peer"
                  readOnly // optional: if no onChange handler
                />
                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:left-[2px]"></div>
              </div>
            </div>

            <button className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition text-sm">
              Edit Product
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
