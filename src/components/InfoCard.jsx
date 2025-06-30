import {ChevronRight } from "lucide-react";

export const InfoCard = ({ icon, title, value, selected }) => {
   return (
    <div
      className={`flex items-center justify-between gap-2 p-4 rounded-lg transition-all ${
        selected
          ? "bg-[#0C1D2C] text-white"
          : "bg-[#EFEFEF] text-gray-800 hover:shadow"
      }`}
    >
      <div>
        <h3 className="text-lg font-bold">{value}</h3>
        <div className="flex items-center gap-1">
          <div className="text-xl opacity-70">{icon}</div>
          <p className="text-xs mt-1 text-inherit">{title}</p>
        </div>
      </div>
      <div className="bg-white p-1 rounded-full">
        <ChevronRight size={16} className="text-black" />
      </div>
    </div>
  );
};