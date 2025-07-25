import {
  Edit,
  Trash2,
  Plus,
  Upload,
  FileText,
  Circle,
  Star,
  ArrowLeft,
  ImagePlus,
  Fingerprint,
  KeyRound,
  CreditCard,
} from "lucide-react";
import { TbCircleCheckFilled } from "react-icons/tb";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border px-3 py-1 text-xs rounded shadow-sm">
        ₹ {payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

const salesData = [
  { name: "Jul 15", sales: 20000 },
  { name: "Jul 16", sales: 10000 },
  { name: "Jul 17", sales: 50000 },
  { name: "Jul 18", sales: 20000 },
  { name: "Jul 19", sales: 95000 },
  { name: "Jul 20", sales: 68000 },
  { name: "Jul 21", sales: 60000 },
];

const sampleProducts = [
  {
    id: 1,
    name: "YDME100NxT Smart Door Lock",
    discription:
      "YDME50 Nxt smart lock in brown color, is a smart and extremely convenient solution for your home. You can have all the various access option to enter your home either via our new biometric fingerprint scan, personalized PIN code.",
    sku: "YDME100_NxT_BLK",
    retail: "64,199",
    wholesale: "70,299",
    stock: 200,
    sold: 50,
    variants: 6,
    status: "Active",
    image: "/lock1.png",
    category: "Digital Safe Lockers",
    mrp: "90,000",
    colorVariants: [{ name: "Yellow", price: "90,000", color: "yellow" }],
    keyfeatures: [
      { icon: <Fingerprint className="w-6 h-6" />, label: "Bio-Metric" },
      { icon: <KeyRound className="w-6 h-6" />, label: "Manual Key Access" },
      { icon: <CreditCard className="w-6 h-6" />, label: "Manual Card Access" },
    ],
    features: [
      {
        title: "Remote Access",
        desc: "Unlock from anywhere using mobile app.",
        image: "/lock2.png",
      },
      {
        title: "Fingerprint Unlock",
        desc: "Biometric fingerprint sensor for secure access.",
        image: "/lock3.png",
      },
      {
        title: "PIN Code Entry",
        desc: "Set personalized PIN codes for family members.",
        image: "/lock1.png",
      },
    ],
    reviews: [
      {
        user: "James Collins",
        comment: "Great lock with smooth access.",
        rating: 4.5,
      },
      {
        user: "Priya Sharma",
        comment: "Easy to install and use. Highly recommended!",
        rating: 5,
      },
    ],
  },
  {
    id: 2,
    name: "Yale YDME50NXT Door Lock",
    discription:
      "YDME50 Nxt smart lock in brown color, is a smart and extremely convenient solution for your home. You can have all the various access option to enter your home either via our new biometric fingerprint scan, personalized PIN code.",
    sku: "YDME50NXT_BRN",
    retail: "45,000",
    wholesale: "50,000",
    stock: 120,
    sold: 30,
    variants: 3,
    status: "Active",
    image: "/lock2.png",
    category: "Digital Safe Lockers",
    mrp: "60,000",
    colorVariants: [
      { name: "Brown", price: "60,000", color: "brown" },
      { name: "Black", price: "62,000", color: "black" },
    ],
    features: [
      {
        title: "Bluetooth Unlock",
        desc: "Unlock using Bluetooth connectivity.",
        image: "/lock5.png",
      },
      {
        title: "Emergency Key",
        desc: "Mechanical key for emergency situations.",
        image: "/lock6.png",
      },
    ],
    reviews: [
      {
        user: "Amit Verma",
        comment: "Reliable and sturdy product.",
        rating: 4,
      },
      {
        user: "Sara Lee",
        comment: "The app integration is fantastic.",
        rating: 4.5,
      },
    ],
  },
  {
    id: 3,
    name: "Yale YDR41A Smart Lock",
    discription:
      "YDR41A is a digital safe locker with advanced security features. It offers RFID card access and auto-lock functionality for enhanced safety.",
    sku: "YDR41A_SILVER",
    retail: "38,500",
    wholesale: "42,000",
    stock: 80,
    sold: 20,
    variants: 2,
    status: "Inactive",
    image: "/lock3.png",
    category: "Digital Safe Lockers",
    mrp: "50,000",
    colorVariants: [
      { name: "Silver", price: "50,000", color: "gray" },
      { name: "Gold", price: "52,000", color: "yellow" },
    ],
    features: [
      {
        title: "RFID Card Access",
        desc: "Unlock with RFID cards for convenience.",
        image: "/lock7.png",
      },
      {
        title: "Auto Lock",
        desc: "Automatically locks after closing the door.",
        image: "/lock8.png",
      },
    ],
    reviews: [
      {
        user: "John Doe",
        comment: "Good value for money.",
        rating: 3.5,
      },
    ],
  },
];

const ProductDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = sampleProducts.find((p) => p.id === parseInt(id));

  if (!product) return <p className="p-4">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto text-gray-800 text-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-4">
        <div>
          <p className="text-xs text-gray-500 inline-flex">
            Product & Stock /{" "}
          </p>
          <h1 className="font-semibold text-xs inline-flex">{product.name}</h1>
          <p className="text-xs text-gray-500 mt-1">
            SKU:{" "}
            <span className="text-gray-800 font-semibold">{product.sku}</span>
          </p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 text-xs">
          <Plus size={16} /> Create New Category
        </button>
      </div>

      {/* Image, Graph & Description Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Images & Inputs */}
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          {/* Image Gallery */}
          <div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[product.image, "/lock2.png", "/lock3.png", "/lock3.png"].map(
                (src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-20 h-20 bg-white object-contain rounded-md border border-gray-400"
                  />
                )
              )}
              <div className="w-20 h-20 bg-white border-2 p-1 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-blue-50 transition">
                <ImagePlus className="w-5 h-5 text-gray-600" />
                <span className="mt-2 text-xs text-gray-700 font-medium">
                  Add Images
                </span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start my-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <Upload className="w-4 h-4" /> Upload .txt file
              </button>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-3">
              <p className="text-sm text-gray-800 leading-relaxed">
                {product.discription}
              </p>
              {/* File Display */}
              <div className="mt-3 flex items-center justify-between bg-white border border-gray-400 rounded-md px-2 py-2 shadow-sm w-2/3 sm:w-1/3">
                <div className="flex items-center gap-2">
                  <FileText className="text-red-500 w-5 h-5" />
                  <span className="text-[8px] font-medium text-gray-700">
                    {product.sku}
                  </span>
                  <TbCircleCheckFilled className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Category & Brand Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                defaultValue="Digital safe lockers"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                defaultValue="Yale"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Graph & Key Features */}
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          {/* Sales Graph Card */}
          <div className="bg-white shadow border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium text-sm">Total Sales</p>
              <span className="text-xs text-blue-600 underline cursor-pointer">
                View all
              </span>
            </div>
            <p className="text-2xl font-semibold mb-1">₹ 2,996</p>
            <p className="text-xs text-green-600 mb-2">
              ▲ 20.8% <span className="text-gray-500">Compare to Last Week</span>
            </p>
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="border border-gray-300 rounded-md bg-white p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.keyfeatures.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-xs font-medium text-gray-800">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
        {/* MRP Price */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">MRP Price*</label>
          <input
            type="text"
            value={product.mrp}
            readOnly
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        {/* Selling Price */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Selling Price*</label>
          <input
            type="text"
            value={product.retail}
            readOnly
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        {/* Discount (%) */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Discount (%)</label>
          <input
            type="text"
            value={product.discount || "00"}
            readOnly
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        {/* Stock Quantity */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Stock Quantity*</label>
          <input
            type="text"
            value={product.stock}
            readOnly
            className="w-full border border-gray-300 bg-white rounded-md px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {/* Product ID & Color Variants */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-1/2">
          <label className="block text-sm text-gray-600 mb-2">Product Id*</label>
          <input
            type="text"
            value={product.sku}
            readOnly
            className="w-full border border-gray-300 bg-white rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        {product.colorVariants?.length > 0 && (
          <div className="w-full md:w-1/2">
            <label className="text-xs text-gray-500 mb-1 block">
              Color Variants & Price
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              {product.colorVariants.map((variant, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md flex-1"
                >
                  <Circle
                    className={`w-3 h-3 text-${variant.color}-500 fill-${variant.color}-500`}
                  />
                  <span>
                    {variant.name} – ₹{variant.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Gallery */}
      {product.features?.length > 0 && (
        <div className="mb-6">
          <label className="text-sm text-gray-700 font-medium block mb-2">
            Features
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <div className="flex flex-wrap gap-4">
              {product.features.map((feature, i) => (
                <div
                  key={i}
                  className="w-40 border border-gray-400 rounded-md p-2"
                >
                  <div className="rounded overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-24 object-contain rounded"
                    />
                    <div className="pt-1.5">
                      <h4 className="text-xs font-semibold text-gray-800">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {product.reviews?.length > 0 && (
        <div className="mb-6">
          <label className="text-sm font-medium block mb-4">
            Ratings & Reviews
          </label>
          <div className="flex flex-col md:flex-row gap-6 border border-gray-400 p-4 rounded-md bg-white">
            {/* Summary & Breakdown */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-400 pr-0 md:pr-6">
              <div className="text-3xl font-bold flex items-center text-yellow-500">
                {product.reviews[0].rating}
                <span className="text-xl text-black ml-1">/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Based on {product.reviews.length} Rating
                {product.reviews.length > 1 ? "s" : ""}
              </p>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = product.reviews.filter(
                  (r) => Math.round(r.rating) === star
                ).length;
                const percent =
                  product.reviews.length > 0
                    ? (count / product.reviews.length) * 100
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-4">{star}</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 h-2 rounded">
                      <div
                        className="h-2 bg-yellow-400 rounded"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-4 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Reviews List */}
            <div className="w-full md:w-2/3">
              {product.reviews.map((review, i) => (
                <div
                  key={i}
                  className="border border-gray-400 rounded-md p-4 bg-gray-50 mb-3 flex flex-col md:flex-row gap-3"
                >
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 10}`}
                    alt={review.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{review.user}</p>
                        <div className="flex items-center text-yellow-500 text-xs mt-1">
                          {[...Array(Math.round(review.rating))].map(
                            (_, idx) => (
                              <Star
                                key={idx}
                                className="w-4 h-4 fill-yellow-500"
                              />
                            )
                          )}
                          <span className="text-gray-500 ml-2">10/07/2024</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 border border-black text-black rounded-md text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-md text-sm">
          <Trash2 size={16} /> Delete Product
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md text-sm">
          <Edit size={16} /> Edit Product
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsView;
