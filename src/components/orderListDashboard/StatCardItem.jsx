import React from "react";

const StatCardItem = ({ icon: Icon, label, value, iconColor = "text-gray-400" }) => (
  <div className="flex flex-col gap-1 items-center">
    <span className="text-[13px] text-gray-700 font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`h-4 w-4 ${iconColor}`} />}
      <h4 className="text-[17px] font-semibold text-gray-800">{value}</h4>
    </div>
  </div>
);

export default StatCardItem;
