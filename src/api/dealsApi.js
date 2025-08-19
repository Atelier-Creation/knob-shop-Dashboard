import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URI}/coupan`;

export const getDeals = async () => {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
};

export const createDeal = async (deal) => {
  const res = await axios.post(`${API_BASE}/deals/create`, deal);
  return res.data;
};

export const deleteDeal = async (id) => {
  const res = await axios.delete(`${API_BASE}/deals/${id}`);
  return res.data;
};

export const updateDealStatus = async (id, status) => {
  const res = await axios.patch(`${API_BASE}/deals/${id}`, { status });
  return res.data;
};
