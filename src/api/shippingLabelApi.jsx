// src/api/shippingLabelApi.js
import axios from "axios";
const TRACKING_URL = "https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails";
const BASE_URL = "https://dtdcapi.shipsy.io/api/customer/integration/consignment/shippinglabel/stream";
const CANCEL_URL = "https://dtdcapi.shipsy.io/api/customer/integration/consignment/cancel";
const API_KEY = "e72ca0c0abd5e15dc59aefb964fcf8";

// Existing function
export const downloadShippingLabel = async (referenceNumber, labelCode) => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        reference_number: referenceNumber,
        label_format: "pdf",
        label_code: labelCode, 
      },
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
        Accept: "application/pdf",
      },
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `shipping-label-${referenceNumber}-${labelCode}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading shipping label:", err);
    throw err;
  }
};

// ✅ New function to cancel order
export const cancelShippingOrder = async (awbNumbers = [], customerCode) => {
  if (!awbNumbers.length || !customerCode) {
    throw new Error("AWB number(s) and customer code are required");
  }

  try {
    const res = await axios.post(
      CANCEL_URL,
      {
        AWBNo: awbNumbers,
        customerCode: customerCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error cancelling shipping order:", err.response?.data || err.message);
    throw err;
  }
};


export const trackShipment = async (consignmentNumber) => {
  if (!consignmentNumber) {
    throw new Error("Consignment number is required for tracking");
  }

  try {
    const res = await axios.post(
      TRACKING_URL,
      {
        trkType: "cnno",
        strcnno: consignmentNumber,
        addtnlDtl: "Y",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "", // Add token if required
          // Cookie headers generally not needed unless server requires session
        },
      }
    );

    return res.data; // Returns tracking details JSON
  } catch (err) {
    console.error("Error fetching tracking info:", err.response?.data || err.message);
    throw err;
  }
};