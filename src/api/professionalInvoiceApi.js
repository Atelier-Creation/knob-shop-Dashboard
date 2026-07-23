import axiosInstance from "./axiosInstance";

export const getProfessionalInvoiceSnapshot = async (orderId, refresh = false) => {
  const response = await axiosInstance.get(`/api/invoices/${orderId}`, {
    params: {
      ...(refresh ? { refresh: true } : {}),
      _: Date.now(),
    },
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return response.data;
};

export const getProfessionalInvoicePdfUrl = (orderId, refresh = false) => {
  const baseURL = axiosInstance.defaults.baseURL || "";
  const refreshQuery = refresh ? "?refresh=true" : "";
  return `${baseURL}/api/invoices/${orderId}/pdf${refreshQuery}`;
};

export const downloadProfessionalInvoicePdf = async (orderId, refresh = false) => {
  const response = await axiosInstance.get(`/api/invoices/${orderId}/pdf`, {
    params: refresh ? { refresh: true } : undefined,
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const emailProfessionalInvoice = async (orderId, email) => {
  const response = await axiosInstance.post(`/api/invoices/${orderId}/email`, {
    email,
  });
  return response.data;
};
