import React, { useState, useEffect } from "react";
import { getAllBrochures } from "../../api/brochureApi";

function BroucherList() {
  const [brochures, setBrochures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllBrochures();
        console.log(res)
        console.log(res.brochures)
        setBrochures(res.brochures || []);
      } catch (err) {
        console.error("Error fetching brochures:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="font-semibold text-xl mb-4">Brochure List</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {brochures.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-lg border border-gray-300 bg-white shadow-md overflow-hidden"
          >
            <div className="w-full h-64 overflow-hidden">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  item.pdfLink
                )}&embedded=true`}
                title={`Brochure for ${item.title}`}
                className="w-full h-full"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">Category: {item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BroucherList;
