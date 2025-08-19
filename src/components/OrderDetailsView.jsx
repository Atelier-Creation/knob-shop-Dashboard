import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../api/orderListApi";
import {getProductById} from '../api/productApi'
import { downloadShippingLabel } from "../api/shippingLabelApi";
import { getProductById } from "../api/productApi";
import {
  MapPin,
  Mail,
  Phone,
  MessageCircleMore,
  Loader,
  ChefHat,
  Truck,
  CheckCircle,
  ChevronRight,
  Dot,
  Building2,
} from "lucide-react";
import { TbBrandOffice, TbTax } from "react-icons/tb";

// Dummy data for now
// const dummyOrder = {
//   id: "#12701",
//   date: "Tue, 16 Apr 2025",
//   status: "Paid",
//   product: {
//     image: "/lock1.png",
//     name: "YDMDEMON-KT Smart Door Lock",
//     sku: "YDMDE 100 KT, BR",
//     price: 90000,
//   },
//   payment: {
//     method: "VISA ****4332",
//     subtotal: 90000,
//     shippingFee: 1000,
//     tax: 1000,
//     total: 92000,
//   },
//   customer: {
//     name: "Ayesha Kaur",
//     email: "ayesha.kaur@email.com",
//     phone: "+91 89765 43210",
//     avatar: "/user-avatar.jpg",
//     totalOrders: 1,
//   },
//   shipping: {
//     address:
//       "S F NO.232/A, TELUNGUPALAYAM PIRUVU SELVAPURAM SELVAPURAM, Coimbatore, Tamil Nadu 641026",
//     mapurl:
//       "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62667.59892589007!2d76.88565980039739!3d10.984122690171313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859ea1af32219%3A0x8f1d8575c98a6250!2sCANARA%20BANK%20-%20COIMBATORE%20SELVAPURAM!5e0!3m2!1sen!2sin!4v1752749443244!5m2!1sen!2sin",
//   },
// };

export default function OrderDetailsView() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrichItems, setEnrichedItems] = useState([]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        const data = res.order;
        console.log("order details page data", data);
        // Transform backend order into frontend-friendly shape
        const productIds = data.items.map(item => item.productId);
        const productDetails = await Promise.all(
          productIds.map((pid) => getProductById(pid))
        );
        const enrichedItems = data.items.map((item, index) => ({
          ...item,
          productData: productDetails[index]?.[0] || productDetails[index],
        }));
        console.log("enrichedItems :",enrichedItems)
        const transformedOrder = {
          id: data._id,
          date: new Date(data.createdAt).toDateString(),
          status: data.status || "Paid",
          product: {
            image: data.items?.[0]?.productId?.images?.[0] ||enrichedItems[0].productData[0].images?.[0] || "/placeholder.png",
            name: data.items?.[0]?.productId?.name || data.items?.[0]?.productName||"Product Name",
            sku: data.items?.[0]?.productId?.sku || "SKU",
            price: data.items?.[0]?.price || 0,
          },
          payment: {
            method: data.paymentMethod,
            subtotal: data.items.reduce((sum, item) => sum + item.total, 0),
            shippingFee: 1000,
            tax: 1000,
            total: data.totalAmount + 1000 + 1000,
          },
          customer: {
            name: data.userId?.name || "Customer",
            email: data.userId?.email || "email@example.com",
            phone: data.shippingAddress?.phone || "+91 XXXXX XXXXX",
            avatar: data.userId?.imageUrl || "",
            totalOrders: 1,
          },
          shipping: {
            address: fullAddress,
            mapurl,
          },
          company: {
            companyName: data.companyName,
            GST: data.gstNumber,
          },
        };

        setOrder(transformedOrder);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!order) return <div className="p-6 text-red-600">Order not found</div>;

  const handleDownloadLabel = async () => {
    if (!order?.dtdcReferenceNumber) {
      alert("No reference number found!");
      return;
    }
    try {
      await downloadShippingLabel(order.dtdcReferenceNumber);
    } catch {
      alert("Failed to download shipping label");
    }
  };
  return (
    <div className="p-0 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">{order.date}</p>
          </div>
          <span className="bg-green-200 text-green-700 rounded-full flex items-center text-sm font-medium ps-1 pe-3 py-1">
            <Dot /> {order.status}
          </span>
        </div>

        <div className="border-b border-gray-200 p-4 space-y-4 text-sm text-gray-800">
          {/* Top Row */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Return to{" "}
              <span className="text-black font-medium cursor-pointer hover:underline">
                Knobs Shop
              </span>
            </span>
            <span>
              Estimated arrived at{" "}
              <span className="text-black font-medium">
                18th – 20th of July
              </span>
            </span>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-4 items-center gap-2">
            {/* Step 1: Active */}
            <div className="flex flex-col items-center">
              <Loader className="w-4 h-4 animate-spin text-black" />
              <span className="text-[10px] md:text-xs mt-1 font-medium text-black">
                Review order
              </span>
              <div className="mt-2 w-full h-1 bg-black rounded-full" />
            </div>

            {/* Step 2: Inactive */}
            <div className="flex flex-col items-center">
              <ChefHat className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] md:text-xs mt-1 text-gray-500">
                Preparing order
              </span>
              <div className="mt-2 w-full h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Step 3: Inactive */}
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] md:text-xs mt-1 text-gray-500">
                Shipping
              </span>
              <div className="mt-2 w-full h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Step 4: Inactive */}
            <div className="flex flex-col items-center">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] md:text-xs mt-1 text-gray-500">
                Delivered
              </span>
              <div className="mt-2 w-full h-1 bg-gray-200 rounded-full" />
            </div>
          </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between items-center pt-2 text-sm">
        <button className="text-black underline cursor-pointer">Cancel order</button>
        <button className="flex items-center cursor-pointer border px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-black hover:text-white transition-colors">
          Create Shipping Label
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>

    {enrichItems.map((item) => (
  <div key={item._id} className="border-b border-gray-200 p-4 flex gap-4 items-start">
    <img
      src={item.productData?.images?.[0] || "/placeholder.png"}
      alt={item.productData?.name}
      className="w-20 h-20 rounded object-cover"
    />
    <div>
      <h3 className="text-sm font-semibold">{item.productData?.name}</h3>
      <p className="text-xs text-gray-600 mt-1">{item.productData?.productId || "SKU"}</p>
      <p className="text-sm font-medium mt-2">
        ₹ {item.price.toLocaleString()} × {item.quantity}
      </p>
      <p className="text-sm font-bold">Total: ₹ {item.total.toLocaleString()}</p>
    </div>
  </div>
))}

        {/* Payment Summary */}
        <div className="p-4 space-y-5">
          <div className="flex justify-start items-center gap-2">
            <h3 className="text-sm font-semibold">Payment Details</h3>
            <span className="bg-green-200 text-green-700 rounded-full flex items-center text-sm font-medium ps-1 pe-3">
              <Dot /> {order.status}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span className="text-gray-800">Payment Method</span>
            <span className="font-medium text-gray-800">{order.payment.method}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span className="text-gray-800">Subtotal</span>
            <span>₹{order.payment.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold py-2 border-y text-gray-500 mt-2">
            <span className="text-gray-700">Total</span>
            <span className="font-bold">
              ₹{order.payment.subtotal.toLocaleString()}/-
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-2 text-sm text-gray-800 rounded-xl bg-white py-2 border border-gray-200">
        {/* Customer Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-5">
          <h3 className="text-xs font-medium text-gray-600 mb-4">Customer</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={order.customer.avatar}
                alt={order.customer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{order.customer.name}</p>
                <p className="text-xs text-gray-600">
                  Total {order.customer.totalOrders} order
                </p>
              </div>
            </div>
            <div>
              <MessageCircleMore className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-5">
          <h3 className="text-xs font-medium text-gray-600 mb-4">
            Shipping address
          </h3>
          <div className="rounded-lg overflow-hidden border">
            <iframe
              src={order.shipping.mapurl}
              width="100%"
              height="200"
              className="w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 space-y-0.5 text-sm">
            <p className="font-medium">{order.customer.name}</p>
            <p>{order.shipping.address}</p>
            <a
              href={order.shipping.mapurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-xs font-medium mt-1 hover:underline"
            >
              View on map
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white px-4 py-5">
          <h3 className="text-xs font-medium text-gray-600 mb-4">
            Contact information
          </h3>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-md text-sm font-medium">
              <Mail className="w-4 h-4" /> {order.customer.email}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-md text-sm font-medium">
              <Phone className="w-4 h-4" /> {order.customer.phone}
            </div>
            {order.company?.companyName && order.company?.GST && (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-md text-sm font-medium">
                  <Building2 className="w-4 h-4" /> {order.company?.companyName}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-md text-sm font-medium">
                  <TbTax className="w-4 h-4" /> {order.company?.GST}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
