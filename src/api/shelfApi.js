import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URI}/shelves`;

/**
 * Fetches all shelf items from the backend.
 * @returns {Promise<Object>} A promise that resolves to the API response.
 */
export const getShelves = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shelves:", error);
    throw error;
  }
};

/**
 * Creates a new shelf item.
 * @param {Object} shelfData - The data for the new shelf.
 * @returns {Promise<Object>} A promise that resolves to the created shelf object.
 */
export const createShelf = async (shelfData) => {
  try {
    const response = await axios.post(API_BASE, shelfData);
    return response.data;
  } catch (error) {
    console.error("Failed to create shelf:", error);
    throw error;
  }
};

/**
 * Fetches a single shelf item by its ID.
 * @param {string} id - The ID of the shelf to fetch.
 * @returns {Promise<Object>} A promise that resolves to the shelf object.
 */
export const getShelfById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch shelf with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing shelf item.
 * @param {string} id - The ID of the shelf to update.
 * @param {Object} updatedData - The new data for the shelf.
 * @returns {Promise<Object>} A promise that resolves to the updated shelf object.
 */
export const updateShelf = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update shelf with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a shelf item.
 * @param {string} id - The ID of the shelf to delete.
 * @returns {Promise<Object>} A promise that resolves to a success message.
 */
export const deleteShelf = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete shelf with ID ${id}:`, error);
    throw error;
  }
};