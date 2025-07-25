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