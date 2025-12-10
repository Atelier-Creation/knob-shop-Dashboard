import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/address`;

export const getAddressByUserId = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/user/${userId}`);
    return res.data; 
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch user" };
  }
};

export const updateAddressById = async (addressId, updates) => {
  try {
    const res = await axios.put(`${BASE_URL}/edit/${addressId}`, updates);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to update address" };
  }
};

export const createAddress = async (addressData) => {
  try {
    const res = await axios.post(`${BASE_URL}/create`, addressData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Failed to create address" };
  }
};