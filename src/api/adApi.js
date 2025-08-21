import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/ad`;

/**
 * Create a new advertisement
 * @param {Object} adData - Advertisement payload
 */
export const createAd = async (adData) => {
  const res = await axios.post(`${BASE_URL}/create`, adData);
  return res.data;
};

/**
 * Get all advertisements
 */
export const getAllAds = async () => {
  const res = await axios.get(BASE_URL);
  return Array.isArray(res.data) ? res.data : [];
};

/**
 * Get a single advertisement by ID
 * @param {string} id - Ad ID
 */
export const getAdById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Delete an advertisement by ID
 * @param {string} id - Ad ID
 */
export const deleteAd = async (id) => {
  const res = await axios.delete(`${BASE_URL}/delete/${id}`);
  return res.data;
};
