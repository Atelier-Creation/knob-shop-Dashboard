import { useState } from "react";
import { createDTDCConsignment } from "../api/createOrderConsigment";
import { updateOrderByOrderId } from "../api/orderListApi";

export default function ShippingModal({
  isOpen,
  onClose,
  order,
  dtdcPayload,
  onOrderUpdate,
}) {
  const [mode, setMode] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const markAsShipped = async (reference) => {
    const updated = await updateOrderByOrderId(order._id, {
      dtdcReferenceNumber: reference,
      status: "shipped",
    });

    onOrderUpdate(updated);
    onClose();
  };

  const handleOwnShipping = async () => {
    await markAsShipped("ownship");
  };

  const handleDTDC = async () => {
    try {
      setCreating(true);
      const res = await createDTDCConsignment(dtdcPayload);
      const consignmentNo = res?.data?.consignmentNo;

      if (!consignmentNo) {
        alert("Consignment number not received");
        return;
      }

      await markAsShipped(consignmentNo);
    } catch (err) {
      console.error(err);
      alert("Failed to create consignment");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white border border-[#db7b2c] w-[430px] rounded-lg p-6 space-y-5 shadow-lg">
        <h2 className="text-lg font-bold text-center">
          Choose Shipping Method
        </h2>

        {/* Options */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode("own")}
            className={`flex-1 py-2 rounded-md border border-gray-400 ${
              mode === "own" ? "bg-[#783904] text-white" : "bg-white"
            }`}
          >
            Own Shipping
          </button>

          <button
            onClick={() => setMode("dtdc")}
            className={`flex-1 py-2 rounded-md border border-gray-400 ${
              mode === "dtdc" ? "bg-[#783904] text-white" : "bg-white"
            }`}
          >
            DTDC Shipping
          </button>
        </div>

        {/* ---- OWN SHIPPING ---- */}
        {mode === "own" && (
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold">Shipping Info</h3>
            <p>
              <b>Address:</b> {order.shippingAddress.street},{" "}
              {order.shippingAddress.city}
            </p>
            <p>
              <b>Email:</b> {order.customer.email}
            </p>
            <p>
              <b>Mobile:</b> {order.shippingAddress.phone}
            </p>

            <button
              onClick={handleOwnShipping}
              className="w-full bg-green-600 text-white py-2 rounded-md mt-2"
            >
              Mark as Own Shipping
            </button>
          </div>
        )}

        {/* ---- DTDC SHIPPING ---- */}
        {mode === "dtdc" && (
          <div className="space-y-4 text-center">
            {order.dtdcReferenceNumber &&
            order.dtdcReferenceNumber !== "N/A" && order.dtdcReferenceNumber !== "ownship" ? (
              <>
                <p className="text-sm">
                  <b>Consignment No:</b> {order.dtdcReferenceNumber}
                </p>
              </>
            ) : (
              <button
                onClick={handleDTDC}
                disabled={creating}
                className="w-full bg-blue-600 text-white py-2 rounded-md"
              >
                {creating ? "Creating..." : "Create DTDC Consignment"}
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => {
            setMode("");
            onClose();
          }}
          className="w-full border border-[#db7b2c] text-[#db7b2c] 
             hover:bg-[#db7b2c] hover:text-white 
             py-2 rounded-md 
             transition-all duration-300 ease-in-out"
        >
          Close
        </button>
      </div>
    </div>
  );
}
