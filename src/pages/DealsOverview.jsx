import { useEffect, useState } from "react";
import { Plus, Trash2, LinkIcon } from "lucide-react";
import { Flame, Clock, XCircle, ThumbsUp } from "lucide-react";
import StatusCardDeal from "../components/StatusCardDeal";
import { Link } from "react-router-dom";
import { deleteDeal, getDeals, updateDeal } from "../api/dealsApi";
import toast from "react-hot-toast";
import moment from "moment"; // Make sure to install moment.js or a similar library for date formatting

const tabs = ["All", "Active", "Scheduled", "Expired"];

const statusColors = {
  Active: "text-green-600",
  Scheduled: "text-yellow-600",
  Expired: "text-red-600",
};

const DealsOverview = () => {
  const [deals, setDeals] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    Active: 0,
    Scheduled: 0,
    Expired: 0,
    Top: 0, // Assuming this is calculated separately
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
  try {
    setLoading(true);
    const data = await getDeals();
    const today = moment();

    // auto-update deals whose startDate <= now but isActive is false
    const autoActivatePromises = data.map(async (coupon) => {
      const startDate = moment(coupon.startDate);
      const expiryDate = moment(coupon.expiryDate);

      if (startDate.isSameOrBefore(today) && expiryDate.isAfter(today) && coupon.isActive === false) {
        try {
          await updateDeal(coupon._id, { isActive: true });
          coupon.isActive = true; // sync locally
        } catch (err) {
          console.error(`Failed to auto-activate coupon ${coupon._id}`, err);
        }
      }
      return coupon;
    });

    const updatedCoupons = await Promise.all(autoActivatePromises);
    const mappedDeals = mapApiDataToDeals(updatedCoupons);
    setDeals(mappedDeals);
    calculateStatusCounts(mappedDeals);

  } catch (err) {
    toast.error("Failed to load deals");
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  const mapApiDataToDeals = (coupons) => {
    const today = moment();

    return coupons.map((coupon) => {
      let status;
      const startDate = moment(coupon.startDate);
      const expiryDate = moment(coupon.expiryDate);

      if (expiryDate.isBefore(today)) {
        status = "Expired";
      } else if (startDate.isAfter(today)) {
        status = "Scheduled";
      } else {
        status = "Active";
      }

      // Format discount based on type
      let discountText;
      if (coupon.type === "percentage") {
        discountText = `${coupon.value}%`;
      } else if (coupon.type === "flat") {
        discountText = `₹${coupon.value}`;
      } else {
        discountText = coupon.value;
      }

      let appliesToText =
        coupon.appliesTo === "single" ? "A Single Product" : "All Products";

      return {
        id: coupon._id, // Add id for deletion
        title: `Coupon: ${coupon.code}`,
        discount: discountText,
        productId : coupon.productId,
        type: coupon.type,
        status: status,
        validity: `${moment(coupon.startDate).format("MMM DD")} - ${moment(
          coupon.expiryDate
        ).format("MMM DD")}`,
        appliesTo: appliesToText,
      };
    });
  };

  const calculateStatusCounts = (mappedDeals) => {
    const counts = mappedDeals.reduce(
      (acc, deal) => {
        if (deal.status in acc) {
          acc[deal.status]++;
        }
        return acc;
      },
      { Active: 0, Scheduled: 0, Expired: 0 }
    );

    // Set status counts dynamically
    setStatusCounts({ ...counts, Top: 0 }); // Assuming 'Top' is a separate metric
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      await deleteDeal(id);
      toast.success("Deal deleted");
      fetchDeals(); // Refresh the list
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete deal");
    }
  };

  const filteredDeals =
    activeTab === "All" ? deals : deals.filter((d) => d.status === activeTab);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for Heading */}
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-9 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Skeleton for Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 animate-pulse rounded-md"
            ></div>
          ))}
        </div>

        {/* Skeleton for Tabs */}
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>

        {/* Skeleton for Table */}
        <div className="rounded border border-gray-300 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Deal Title",
                    "Discount",
                    "Type",
                    "Status",
                    "Validity",
                    "Applies To",
                    "Action",
                  ].map((heading, i) => (
                    <th key={i} className="p-3 text-left">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t">
                    {Array(7)
                      .fill("")
                      .map((_, j) => (
                        <td key={j} className="p-3">
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Skeleton */}
            <div className="space-y-4 md:hidden p-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-300 rounded-md p-4 bg-white"
                >
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="h-4 w-24 bg-gray-200 animate-pulse rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="rounded border border-gray-300 overflow-hidden">
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
              {filteredDeals?.length > 0 ? (
                filteredDeals.map((deal) => {
                  console.log(deal); // ✅ log correctly inside {}
                  return (
                    <tr
                      key={deal.id}
                      className="border-t hover:bg-gray-100 transition-colors"
                    >
                      <td className="p-3 font-medium text-black">
                        {deal.title}
                      </td>
                      <td className="p-3">{deal.discount}</td>
                      <td className="p-3">{deal.type}</td>
                      <td
                        className={`p-3 font-medium ${
                          statusColors[deal.status]
                        }`}
                      >
                        {deal.status}
                      </td>
                      <td className="p-3">{deal.validity}</td>
                      <td className="p-3">
                        {deal.appliesTo === "A Single Product" ? (
                          <>
                            {deal.appliesTo}{" "}
                            <a
                              href={`https://knobsshop.store/product/${deal.productId}`}
                              target="_blank"
                              title="view Product"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-500 hover:text-blue-700"
                            >
                              <LinkIcon size={14} />
                            </a>
                          </>
                        ) : (
                          deal.appliesTo
                        )}
                      </td>

                      <td className="p-3">
                        <Trash2
                          className="w-4 h-4 text-red-500 cursor-pointer"
                          onClick={() => handleDelete(deal.id)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">
                    No deals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile Card Layout */}
          <div className="space-y-4 md:hidden p-2">
            {filteredDeals?.length > 0 ? (
              filteredDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="border border-gray-300 rounded-md p-4 shadow-sm bg-white"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold">{deal.title}</h3>
                    <Trash2
                      className="w-4 h-4 text-red-500 cursor-pointer"
                      onClick={() => handleDelete(deal.id)}
                    />
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium text-gray-900">
                        Discount:
                      </span>{" "}
                      {deal.discount}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Type:</span>{" "}
                      {deal.type}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Status:</span>{" "}
                      <span
                        className={`${statusColors[deal.status]} font-medium`}
                      >
                        {deal.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Validity:
                      </span>{" "}
                      {deal.validity}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Applies To:
                      </span>{" "}
                      {deal.appliesTo}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No deals found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsOverview;
