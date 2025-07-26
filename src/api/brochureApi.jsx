import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/brochures`;

export const getAllBrochures = async () => {
  const res = await axios.post(`${BASE_URL}`);
  return res.data;
};

export const createBrochure = async (data) => {
  const res = await axios.post(`${BASE_URL}`, data);
  return res.data;
};
