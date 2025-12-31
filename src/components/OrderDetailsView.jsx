import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById, updateOrderByOrderId } from "../api/orderListApi";
import { getProductById } from "../api/productApi";
import { downloadShippingLabel } from "../api/shippingLabelApi";
import ShippingModal from "../components/ShippingModal";
import { createDTDCConsignment } from "../api/createOrderConsigment";
import {
  MapPin,
  Mail,
  Phone,
  User,
  MessageCircleMore,
  Loader,
  ChefHat,
  Truck,
  CheckCircle,
  ChevronRight,
  Dot,
  Building2,
} from "lucide-react";
import { TbTax } from "react-icons/tb";

// Utility: Format currency
const formatCurrency = (num) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);

export default function OrderDetailsView() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showLabelOptions, setShowLabelOptions] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("");
  const [creatingConsignment, setCreatingConsignment] = useState(false);

  const LABEL_OPTIONS = [
    { label: "Shipping Label A4", code: "SHIP_LABEL_A4" },
    { label: "Shipping Label A6", code: "SHIP_LABEL_A6" },
    { label: "Shipping Label POD", code: "SHIP_LABEL_POD" },
    { label: "Shipping Label 4x6", code: "SHIP_LABEL_4X6" },
    { label: "Routing Label A4", code: "ROUTE_LABEL_A4" },
    { label: "Routing Label 4x4", code: "ROUTE_LABEL_4X4" },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        const data = res.order;

        // Build full address
        const fullAddress = `${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.district}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}`;
        const mapurl = `https://www.google.com/maps?q=${encodeURIComponent(
          fullAddress
        )}`;

        // Fetch product details
        const productIds = data.items.map((item) => item.productId);
        const productDetails = await Promise.all(
          productIds.map((pid) => getProductById(pid))
        );

        const enriched = data.items.map((item, index) => ({
          ...item,
          productData: productDetails[index]?.[0] || productDetails[index],
        }));
        setEnrichedItems(enriched);

        // Discount logic
        let discountType = "flat";
        let discountPercentage = null;

        if (data.discountAmount > 0 && data.totalAmount > 0) {
          const calcPercent = (data.discountAmount / data.totalAmount) * 100;
          if (Math.abs(calcPercent - Math.round(calcPercent)) < 0.5) {
            discountType = "percentage";
            discountPercentage = Math.round(calcPercent);
          }
        }

        // -------------------------------
        // EINVOICE + EWAYBILL CALCULATION
        // -------------------------------
        const totalValue = data.finalAmount || data.totalAmount;
        const shippingState =
          data.shippingAddress?.state?.trim()?.toLowerCase() || "";

        const enableEinvoice = !!data.companyName && !!data.gstNumber;

        let enableEwaybill = false;

        if (shippingState !== "tamil nadu" && totalValue > 50000) {
          enableEwaybill = true;
        } else if (shippingState === "tamil nadu" && totalValue > 100000) {
          enableEwaybill = true;
        }

        // -------------------------------
        // Transform order
        // -------------------------------
        const transformedOrder = {
          id: data._id,
          _id: data._id, // needed for DTDC payload
          date: new Date(data.createdAt).toDateString(),
          status: data.status || "Pending",
          orderId: data.orderId || data._id,

          // RAW FIELDS needed for DTDC
          items: data.items,
          shippingAddress: data.shippingAddress,
          totalAmount: data.finalAmount || data.totalAmount,
          ewayBill: data.ewayBill || "",

          payment: {
            method: data.paymentMethod,
            Paymentstatus: data.paymentStatus,
            subtotal: data.totalAmount,
            discountAmount: data.discountAmount,
            discountType,
            discountPercentage,
            couponCode: data.couponCode,
            total: totalValue,
          },

          customer: {
            name: data.userId?.name || "Customer",
            email: data.userId?.email || "email@example.com",
            phone: data.shippingAddress?.phone || "N/A",
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

          dtdcReferenceNumber: data.dtdcReferenceNumber,

          enableEinvoice,
          enableEwaybill,
        };

        setOrder(transformedOrder);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleInvoice = (order) => {
    // console.log("Generating invoice for order:", order);
  const payload = {
    shippingAddress: order.shippingAddress,          // full address
    cartItems: order.items,                           // product list
    totalAmount: order.totalAmount,     
    discountAmount: order.payment.discountAmount || 0,
    dtdcReferenceNumber: order.dtdcReferenceNumber || "PICKUP",
    userId: order.userId?._id || null,              // user ID
    paymentMethod: order.payment?.method || "online",
    invoiceDate: new Date().toLocaleDateString(),     // today
    orderId: order.orderId,                                 // order number
    company: {
      companyName: order.company?.companyName || null,
      GST: order.company?.GST || null
    }
  };

  localStorage.setItem("latestInvoiceData", JSON.stringify(payload));
  navigate("/invoice");
};

  const handleDownloadLabel = async (labelCode) => {
    setDownloading(true);
    try {
      // 1️⃣ Download the label
      await downloadShippingLabel(order.dtdcReferenceNumber, labelCode);
      setDownloaded(true);

      // 2️⃣ Update order status to "confirmed"
      const updatedOrder = await updateOrderByOrderId(order.id, {
        status: "confirmed",
      });

      // 3️⃣ Update local state so UI shows new status
      setOrder((prev) => ({
        ...prev,
        status: updatedOrder.status || "confirmed",
      }));
    } catch (err) {
      alert("Failed to download shipping label or update order status");
      console.error(err);
    } finally {
      setDownloading(false);
      setShowLabelOptions(false);
    }
  };

  const buildDTDCPayload = (order) => {
    const cartItems =
      order?.items?.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        sku: item.sku || "N/A",
        price: item.price,
        total: item.total,
        weight: item.weight || 1,
      })) || [];

    const totalWeight = cartItems
      .reduce((sum, item) => sum + (item.weight || 1), 0)
      .toFixed(1);

    const shippingData = {
      name: order?.shippingAddress?.name,
      email: order?.customer?.email,
      phone: order?.shippingAddress?.phone,
      street: order?.shippingAddress?.street,
      city: order?.shippingAddress?.city,
      district: order?.shippingAddress?.district,
      pincode: order?.shippingAddress?.pincode,
      state: order?.shippingAddress?.state,
    };

    return {
      _id: order?._id,
      SKU: cartItems[0]?.productId || "N/A", // first product SKU
      invoiceNo: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      totalAmount: cartItems[0]?.total,
      ewayBill: order?.ewayBill || "",
      shippingAddress: shippingData,
      cartItems: cartItems,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        weight: totalWeight,
      },
    };
  };

  const dtdcPayload = buildDTDCPayload(order);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader className="animate-spin mr-2" /> Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className="p-6 text-red-600">
        Order not found or product information is missing.
      </div>
    );

  return (
    <div className="p-0 grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-6">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">{order.date}</p>
          </div>
          <span className="bg-green-200 text-green-700 rounded-full flex items-center text-sm font-medium ps-1 pe-4 py-1 capitalize">
            <Dot /> {order.status}
          </span>
        </div>

        {/* Order Steps */}
        <div className="border-b border-gray-200 p-4 space-y-4 text-sm text-gray-800">
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Return to{" "}
              <span className="text-black font-medium cursor-pointer hover:underline">
                Knobs Shop
              </span>
            </span>
            <span>
              Estimated delivery:{" "}
              <span className="text-black font-medium">
                18th – 20th of July
              </span>
            </span>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <div className="flex flex-col items-center">
              <Loader className="w-4 h-4 animate-spin text-black" />
              <span className="text-[10px] md:text-xs mt-1 font-medium text-black">
                Review order
              </span>
              <div className="mt-2 w-full h-1 bg-black rounded-full" />
            </div>

            <div className="flex flex-col items-center">
              {downloaded ? (
                <ChefHat className="w-4 h-4 text-black animate-bounce" />
              ) : (
                <ChefHat className="w-4 h-4 text-gray-400" />
              )}
              <span
                className={`text-[10px] md:text-xs mt-1 ${
                  downloaded ? "font-medium text-black" : "text-gray-500"
                }`}
              >
                Preparing order
              </span>
              <div
                className={`mt-2 w-full h-1 rounded-full ${
                  downloaded ? "bg-black" : "bg-gray-200"
                }`}
              />
            </div>

            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] md:text-xs mt-1 text-gray-500">
                Shipping
              </span>
              <div className="mt-2 w-full h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="flex flex-col items-center">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] md:text-xs mt-1 text-gray-500">
                Delivered
              </span>
              <div className="mt-2 w-full h-1 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center pt-2 text-sm">
            <button className="text-black underline cursor-pointer">
              Cancel order
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">
                Change Status:
              </label>
              <select
                className="border rounded-md text-sm px-2 py-1 bg-white"
                value={order.status}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setShowStatusModal(true);
                }}
              >
                {[
                  "pending",
                  "confirmed",
                  "shipped",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {order?.dtdcReferenceNumber === "PICKUP" ? (
              <button
                disabled
                className="border px-3 py-1.5 rounded-full bg-gray-800 text-gray-100 cursor-not-allowed font-medium"
              >
                SHOP PICKUP ORDER
              </button>
            ) : !order?.dtdcReferenceNumber ||
              order?.dtdcReferenceNumber === "N/A" ? (
              <button
                className="border px-3 py-1.5 rounded-md bg-black text-white font-medium"
                onClick={() => setShowShippingModal(true)}
              >
                Manage Shipping
              </button>
            ) : order?.dtdcReferenceNumber === "ownship" ? (
              <button
                onClick={() => setShowShippingModal(true)}
                className="border px-3 py-1.5 rounded-full bg-gray-800 text-gray-100 cursor-not-allowed font-medium"
              >
                Shipped by Own
              </button>
            ) : (
              <div className="relative">
                <button
                  className={`flex items-center border px-3 py-1.5 rounded-md font-medium shadow-sm transition-colors ${
                    downloaded
                      ? "bg-black/80 text-white/80"
                      : "hover:bg-black hover:text-white"
                  }`}
                  onClick={() => setShowLabelOptions(!showLabelOptions)}
                >
                  {downloading
                    ? "Downloading..."
                    : downloaded
                    ? "Shipping Label Downloaded"
                    : "Create Shipping Label"}
                  {!downloaded && !downloading && (
                    <ChevronRight className="w-4 h-4 ml-1" />
                  )}
                </button>

                {/* Dropdown */}
                {showLabelOptions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {LABEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => handleDownloadLabel(opt.code)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items */}
        {enrichedItems.map((item) => {
          return (
            <div
              key={item._id}
              className="border-b border-gray-200 p-4 flex gap-4 justify-between items-baseline"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={item.productData?.images?.[0] || "/placeholder.png"}
                  alt={item.productData?.name}
                  className="w-20 h-20 rounded object-contain border border-gray-200 shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold capitalize">
                    {item.productData?.name}
                  </h3>
                  {item?.sku && (
                    <p className="text-xs  mt-1">
                      SKU: <strong>{item?.sku || "SKU"}</strong>
                    </p>
                  )}
                  {item.size && (
                    <p className="text-xs font-medium mt-1">
                      Size: <strong>{item.size} | </strong>
                      {item.color && (
                        <span className="text-xs inline-flex font-bold mt-1 items-center gap-2">
                          Color:
                          {/^#([0-9A-F]{3}){1,2}$/i.test(item.color) ||
                          /^rgb/.test(item.color) ? (
                            <span
                              style={{
                                backgroundColor: item.color,
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                display: "inline-block",
                                border: "1.5px solid #a39f9f",
                              }}
                            ></span>
                          ) : (
                            <span>{item.color}</span>
                          )}
                        </span>
                      )}
                    </p>
                  )}

                  <p className="text-sm font-medium mt-1">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold mt-2">
                Total Price: <strong>{formatCurrency(item.total)}</strong>
              </p>
            </div>
          );
        })}

        {/* Payment Summary */}
        <div className="p-4 space-y-5">
          <div className="flex justify-start items-center gap-2">
            <h3 className="text-sm font-semibold">Payment Details</h3>
            <span className="bg-green-200 text-green-700 rounded-full flex items-center text-sm font-medium ps-1 pe-3.5 py-1 capitalize">
              <Dot /> {order.status}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Payment Method</span>
            <span className="font-medium">{order.payment.method}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Payment Status</span>
            {order.payment?.Paymentstatus && (
              <span
                className={`
        text-xs font-semibold rounded-full px-2 py-0.5 capitalize
        ${
          order.payment.Paymentstatus === "success"
            ? "text-green-700 bg-green-100"
            : order.payment.Paymentstatus === "pending"
            ? "text-yellow-700 bg-yellow-100"
            : order.payment.Paymentstatus === "failure"
            ? "text-red-700 bg-red-100"
            : order.payment.Paymentstatus === "refund"
            ? "text-blue-700 bg-blue-100"
            : "text-gray-700 bg-gray-100"
        }
      `}
              >
                {order.payment.Paymentstatus}
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(order.payment.subtotal)}</span>
          </div>

          {order.payment.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                Discount{" "}
                {order.payment.couponCode && (
                  <span className="text-xs text-blue-600 font-medium">
                    ({order.payment.couponCode})
                  </span>
                )}
              </span>
              <span className="font-medium text-green-700">
                - {formatCurrency(order.payment.discountAmount)}{" "}
                {order.payment.discountType === "percentage" &&
                  `(${order.payment.discountPercentage}%)`}
                {order.payment.discountType === "flat" && "(flat)"}
              </span>
            </div>
          )}

          <div className="border-t pt-2 mt-2" />

          <div className="flex justify-between text-sm font-semibold text-gray-800">
            <span>Total Paid</span>
            <span className="font-bold text-black">
              {formatCurrency(order.payment.total)}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-2 sticky max-w-full max-h-screen right-0 top-5 text-sm text-gray-800 rounded-xl bg-white py-2 border border-gray-200">
        {/* Customer */}
        <div className="bg-white border-b border-gray-200 px-4 py-5">
          <h3 className="text-xs font-medium text-gray-600 mb-4">Customer</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  order.customer.avatar ||
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                }
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
            <MessageCircleMore className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border-b border-gray-200 px-4 py-5">
          <h3 className="text-xs font-medium text-gray-600 mb-4">
            Shipping address
          </h3>
          <div className="rounded-lg overflow-hidden border">
            <iframe
              src={order.shipping.mapurl + "&output=embed"}
              width="100%"
              height="200"
              className="w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
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
          <div className="space-y-2 space-x-1">
            <div className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md text-sm font-medium">
              <Mail className="w-4 h-4" /> {order.customer.email}
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md text-sm font-medium">
              <Phone className="w-4 h-4" /> {order.customer.phone}
            </div>

            {order.company?.companyName && order.company?.GST && (
              <div className="space-x-1">
                <div className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md text-sm font-medium">
                  <Building2 className="w-4 h-4" /> {order.company.companyName}
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded-md text-sm font-medium">
                  <TbTax className="w-4 h-4" /> {order.company.GST}
                </div>
              </div>
            )}
            <div className="mt-4 space-y-2">
              <button
                className="w-full py-2 text-sm font-medium bg-[#ab7b53] text-white rounded-md hover:bg-[#8d5e38] transition-all 0.3s ease-in-out"
                onClick={() => handleInvoice(order)}
              >
                Generate Invoice
              </button>
              {order.enableEinvoice && (
                <button
                  className="w-full py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all 0.3s ease-in-out"
                  onClick={() => console.log("Generate E-Invoice", order.id)}
                >
                  Generate E-Invoice
                </button>
              )}

              {order.enableEwaybill && (
                <button
                  className="w-full py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => console.log("Generate E-Waybill", order.id)}
                >
                  Generate E-Waybill
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
            <h3 className="text-lg font-semibold mb-3">
              Confirm Status Change
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to change the order status to{" "}
              <span className="font-medium text-black">{selectedStatus}</span>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={updatingStatus}
                onClick={async () => {
                  try {
                    setUpdatingStatus(true);
                    await updateOrderByOrderId(order.id, {
                      status: selectedStatus,
                    });
                    setOrder((prev) => ({ ...prev, status: selectedStatus }));
                    setShowStatusModal(false);
                  } catch (err) {
                    console.error("Failed to update order status", err);
                    alert("Failed to update order status");
                  } finally {
                    setUpdatingStatus(false);
                  }
                }}
                className={`px-4 py-2 rounded-md text-white ${
                  updatingStatus ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                }`}
              >
                {updatingStatus ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ShippingModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        order={order}
        dtdcPayload={dtdcPayload}
        onOrderUpdate={(updatedOrder) => {
          setOrder((prev) => ({
            ...prev,
            ...updatedOrder,
          }));
        }}
      />
    </div>
  );
}
