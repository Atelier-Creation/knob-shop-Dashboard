const StatusCardDeal = ({ icon: Icon, label, count, bgColor, iconBg }) => {
  return (
    <div className={`rounded-xl ${bgColor} p-4`}>
      <div className="flex items-center gap-2">
        <div className={`rounded-full p-2 ${iconBg}`}>
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      </div>
      <div className="mt-4 text-6xl mx-auto font-bold text-gray-800 text-center">{String(count).padStart(2, "0")}</div>
    </div>
  );
};

export default StatusCardDeal;
