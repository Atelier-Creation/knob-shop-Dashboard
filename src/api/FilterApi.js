import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URI}/filter`;

export const fetchFilters = () => axios.get(API_BASE);
export const saveFilter = (filter) => axios.post(API_BASE, filter);
export const deleteFilter = (id) => axios.delete(`${API_BASE}/${id}`);