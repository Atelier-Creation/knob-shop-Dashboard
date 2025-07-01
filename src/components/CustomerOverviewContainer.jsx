import {
  Info,
  Users,
  ShoppingCart,
  User,
} from "lucide-react";
import CustomerOverview from "./CustomerOverview";
import { InfoCard } from "./InfoCard";

const cards = [
    {
      id: 1,
      icon: <Users size={20} className="text-white" />,
      title: "Suppliers",
      value: "10,090",
      selected: true,                       // highlighted (dark) card
    },
    {
      id: 2,
      icon: <User size={20} className="text-black" />,
      title: "Customer",
      value: "989",
      selected: false,
    },
    {
      id: 3,
      icon: <ShoppingCart size={20} className="text-black" />,
      title: "Orders",
      value: "567",
      selected: false,
    },
  ];

const CustomerOverviewContainer = () => {

  return (
    <div className="grid gap-4">
      {/* Overall Information */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5E5]">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-full p-2 bg-blue-200"><Info size={16} className="text-blue-500" /></div>
          <h2 className="text-lg font-semibold text-gray-900">Overall Information</h2>
        </div>
          <div className="grid grid-cols-3 gap-3">
          {cards.map(({ id, icon, title, value, selected }) => (
            <InfoCard
              key={id}
              icon={icon}
              title={title}
              value={value}
              selected={selected}
            />
          ))}
        </div>
      </div>

      {/* Customer Overview */}
      <CustomerOverview/>
    </div>
  );
};

export default CustomerOverviewContainer;
