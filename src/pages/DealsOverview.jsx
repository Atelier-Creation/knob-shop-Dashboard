import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Flame, Clock, XCircle, ThumbsUp } from "lucide-react";
import StatusCardDeal from "../components/StatusCardDeal";
import { Link } from "react-router-dom";

const tabs = ["All", "Active", "Scheduled", "Expired"];

const deals = [
  {
    title: "Monsoon Flat 20%",
    discount: "20%",
    type: "Percentage",
    status: "Active",
    validity: "Jul 01 - Jul 06",
    appliesTo: "All Kitchen Items",
  },
  {
    title: "July Combo Bonanza",
    discount: "₹500",
    type: "Flat ₹ Off",
    status: "Scheduled",
    validity: "Jul 15–Jul 30",
    appliesTo: "Living Room",
  },
  {
    title: "Lock & Save Offer",
    discount: "BUY 1 GET 1 Free",
    type: "Bundle",
    status: "Expired",
    validity: "Jun 1–Jun 15",
    appliesTo: "Digital Lock",
  },
];

const statusCounts = {
  Active: 4,
  Scheduled: 2,
  Expired: 6,
  Top: 6,
};

const DealsOverview = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredDeals =
    activeTab === "All" ? deals : deals.filter((d) => d.status === activeTab);

  const statusColors = {
    Active: "text-green-600",
    Scheduled: "text-yellow-600",
    Expired: "text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Heading + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold me-1">Deals & Discounts</h2>
          <p className="text-sm text-gray-500">/ Overview</p>
        </div>

        <Link
          to={"/deals-discounts/create"}
          className="px-4 py-2 text-sm bg-black text-white rounded flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          Create New Ad
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatusCardDeal
          icon={Flame}
          label="Active Deals"
          count={statusCounts.Active}
          bgColor="bg-lime-100"
          iconBg="bg-lime-300"
        />
        <StatusCardDeal
          icon={Clock}
          label="Scheduled Time"
          count={statusCounts.Scheduled}
          bgColor="bg-blue-100"
          iconBg="bg-blue-300"
        />
        <StatusCardDeal
          icon={XCircle}
          label="Expired"
          count={statusCounts.Expired}
          bgColor="bg-red-100"
          iconBg="bg-red-300"
        />
        <StatusCardDeal
          icon={ThumbsUp}
          label="Top Performing Deal"
          count={statusCounts.Top}
          bgColor="bg-green-100"
          iconBg="bg-green-300"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-2 text-sm ${
              activeTab === tab
                ? "border-b-3 border-black text-black font-medium cursor-pointer"
                : "text-gray-500 cursor-pointer"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Deals Table */}
<div className="rounded border  border-gray-300 overflow-hidden">
  <div className="w-full overflow-x-auto">
    <table className="min-w-[700px] w-full text-sm hidden md:table">
      <thead className="bg-gray-50 text-left text-gray-600">
        <tr>
          <th className="p-3">Deal Title</th>
          <th className="p-3">Discount</th>
          <th className="p-3">Type</th>
          <th className="p-3">Status</th>
          <th className="p-3">Validity</th>
          <th className="p-3">Applies To</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredDeals.map((deal, i) => (
          <tr key={i} className="border-t hover:bg-gray-100 transition-colors">
            <td className="p-3 font-medium text-black">{deal.title}</td>
            <td className="p-3">{deal.discount}</td>
            <td className="p-3">{deal.type}</td>
            <td className={`p-3 font-medium ${statusColors[deal.status]}`}>
              {deal.status}
            </td>
            <td className="p-3">{deal.validity}</td>
            <td className="p-3">{deal.appliesTo}</td>
            <td className="p-3">
              <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile Card Layout */}
    <div className="space-y-4 md:hidden p-2">
      {filteredDeals.map((deal, i) => (
        <div key={i} className="border border-gray-300 rounded-md p-4 shadow-sm bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold">{deal.title}</h3>
            <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div><span className="font-medium text-gray-900">Discount:</span> {deal.discount}</div>
            <div><span className="font-medium text-gray-900">Type:</span> {deal.type}</div>
            <div>
              <span className="font-medium text-gray-900">Status:</span>{" "}
              <span className={`${statusColors[deal.status]} font-medium`}>{deal.status}</span>
            </div>
            <div><span className="font-medium text-gray-900">Validity:</span> {deal.validity}</div>
            <div><span className="font-medium text-gray-900">Applies To:</span> {deal.appliesTo}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


    </div>
  );
};

export default DealsOverview;
