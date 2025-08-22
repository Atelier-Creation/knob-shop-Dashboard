import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/order`;

// Trigger analytics snapshot generation
export const getAllOrders = async () => {
  const res = await axios.get(`${BASE_URL}`);
  return res.data;
};

export const getOrderById = async (orderId) => {
    const res = await axios.get(`${BASE_URL}/${orderId}`);
    return res.data;
  };
  export const updateOrderByOrderId = async (orderId, updates) => {
    const res = await axios.put(`${BASE_URL}/${orderId}`, updates);
    return res.data;
  };

  export const getOrdersByUserId = async(userId)=>{
    const res = await axios.get(`${BASE_URL}/user/${userId}`);
    return res.data
  }

  // Fetch unseen notifications (orders)
export const getUnseenOrders = async () => {
  const res = await axios.get(`${BASE_URL}/notifications/unseen`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// Mark order as seen
export const markOrderAsSeen = async (orderId) => {
  const res = await axios.put(`${BASE_URL}/notifications/${orderId}/seen`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};
