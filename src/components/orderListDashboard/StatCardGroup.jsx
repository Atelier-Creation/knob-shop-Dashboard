import React from "react";
import StatCardItem from "./StatCardItem";

const StatCardGroup = ({ title, stats = [] }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl p-5">
        {stats.map((stat, index) => (
          <StatCardItem
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default StatCardGroup;
