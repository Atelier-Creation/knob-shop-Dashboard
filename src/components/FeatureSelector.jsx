import { useState } from "react";
import {
  Fingerprint,
  CreditCard,
  KeyRound,
  Smartphone,
  RadioReceiver,
  ChevronDown,
  Check,
  X,
  Plus,
} from "lucide-react";

/* Map each feature to a Lucide icon component */
const allFeatures = [
  { name: "Bio‑Metric", Icon: Fingerprint },
  { name: "Manual Card Access", Icon: CreditCard },
  { name: "Manual Key Access", Icon: KeyRound },
  { name: "App Access", Icon: Smartphone },
  { name: "Remote Access", Icon: RadioReceiver },
];

export default function FeatureSelector({ selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const toggleFeature = (name) =>
    setSelected(
      selected.includes(name)
        ? selected.filter((f) => f !== name)
        : [...selected, name],
    );

  return (
    <div className="space-y-2 w-full max-w-md">
      <label className="font-medium text-gray-700">Features*</label>

      {/* Selected pills */}
      <div className="flex flex-wrap gap-2">
        {selected.map((feat) => {
          const { Icon } = allFeatures.find((f) => f.name === feat) || {};
          return (
            <div
              key={feat}
              className="flex items-center gap-2 px-4 py-2 border rounded shadow-sm bg-white"
            >
              {Icon && <Icon size={18} />}
              <span className="text-sm font-medium">{feat}</span>
              <button onClick={() => toggleFeature(feat)}>
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Trigger */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-full border  px-4 py-2 rounded shadow-sm bg-white hover:bg-gray-50"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add Features</span>
          <ChevronDown size={16} className="ml-auto" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-10 mt-1 w-full rounded border shadow bg-white">
            {allFeatures.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => toggleFeature(name)}
                className={`flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 ${
                  selected.includes(name) && "bg-orange-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="text-sm font-medium">{name}</span>
                </div>
                {selected.includes(name) && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
