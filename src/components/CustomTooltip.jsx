export const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const thisWeek = payload.find(item => item.dataKey === "thisWeek")?.value;
      const lastWeek = payload.find(item => item.dataKey === "lastWeek")?.value;
  
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-xs">
          <p className="text-gray-700 font-semibold mb-1">{label}</p>
          <p className="text-red-500">Last Week: ₹{lastWeek?.toFixed(2)}</p>
          <p className="text-green-500">This Week: ₹{thisWeek?.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };
  