// src/api/shippingLabelApi.js
import axios from "axios";

const BASE_URL = "https://dtdcapi.shipsy.io/api/customer/integration/consignment/shippinglabel/stream";

const API_KEY = "e72ca0c0abd5e15dc59aefb964fcf8";

export const downloadShippingLabel = async (referenceNumber) => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        reference_number: referenceNumber,
        label_format: "pdf",
        label_code: "SHIP_LABEL_A4",
      },
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
        Accept: "application/pdf",
      },
      responseType: "blob", // ✅ Important for downloading PDF
    });

    // Convert Blob to download link
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `shipping-label-${referenceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);return link;
  } catch (err) {
    console.error("Error downloading shipping label:", err);
    throw err;
  }
};
