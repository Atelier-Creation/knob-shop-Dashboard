import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/brochures`;

export const getAllBrochures = async () => {
  const res = await axios.get(`${BASE_URL}`);
  return res.data;
};

export const createBrochure = async (data) => {
  const res = await axios.post(`${BASE_URL}`, data);
  return res.data;
};

export const editBrochure = async (brochureId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${brochureId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// This is a placeholder for your actual API call
export const deleteBrochure = async (brochureId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${brochureId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};