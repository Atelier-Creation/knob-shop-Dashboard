import { useState } from "react";

export default function FeatureInput({ features, onChange }) {
  const [input, setInput] = useState('');

  const addFeature = () => {
    if (input.trim() === '') return;
    onChange([...features, input.trim()]);
    setInput('');
  };

  return (
    <div>
      <div className="flex mb-2">
        <input
          className="rounded-md border border-gray-300 p-2 flex-grow   focus:ring-2 focus:ring-[#e0a371] outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter feature"
        />
        <button onClick={addFeature} className="ml-2 px-3 rounded-md py-1 cursor-pointer bg-black text-white">Add</button>
      </div>
      <ul className="list-disc ml-4 text-sm text-gray-600">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </div>
  );
}
