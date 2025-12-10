// src/api/essentialApi.js
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/essentials`;

// Create a new essentials section
export const createEssentials = async (data) => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

// Get all essentials (usually one record)
export const getEssentials = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// Get essentials by ID
export const getEssentialsById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// Update essentials section by ID
export const updateEssentials = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};
export const updateCardInEssentials = async (essentialsId, cardId, data) => {
  const res = await axios.put(
    `${BASE_URL}/${essentialsId}/cards/${cardId}`,
    data
  );
  return res.data;
};
// Delete essentials section by ID
export const deleteEssentials = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
