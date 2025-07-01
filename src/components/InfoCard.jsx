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
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold">{value}</h3>
        <div className="flex items-center gap-1">
          <div className="text-xl opacity-70">{icon}</div>
          <p className="text-xs mt-1 text-inherit">{title}</p>
        </div>
      </div>
      <div className="bg-white p-2 rounded-full flex items-center justify-center">
        <ChevronRight size={"1rem"} className="text-black" />
      </div>
    </div>
  );
};