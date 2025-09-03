import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URI}/coupons`;

export const getDeals = async () => {
  const res = await axios.get(`${API_BASE}`);
  return res.data.coupons;
};

export const createCoupon = async (deal) => {
  const token = localStorage.getItem("authToken");
  const res = await axios.post(`${API_BASE}`, deal, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return res.data;
};
export const updateDeal = async (id, updateData) => {
  const token = localStorage.getItem("authToken");
  const res = await axios.put(
    `${API_BASE}/update/${id}`, 
    updateData,                
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const deleteDeal = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const updateDealStatus = async (id, status) => {
  const res = await axios.patch(`${API_BASE}/deals/${id}`, { status });
  return res.data;
};
