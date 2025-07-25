// src/api/analyticsApi.js
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/analytic`;

// Trigger analytics snapshot generation
export const generateAnalyticsSnapshot = async () => {
  const res = await axios.post(`${BASE_URL}/generate`);
  return res.data;
};

// Get latest snapshot for dashboard (Daily/Weekly/Monthly)
export const getLatestAnalyticsSnapshot = async (range = 'Weekly') => {
  const res = await axios.get(`${BASE_URL}/latest?range=${range}`);
  return res.data;
};

// Get chart data (1D, 1W, 1M, 1Y)
export const getChartData = async (filter = '1Y') => {
    const res = await axios.get(`${BASE_URL}/chart?filter=${filter}`);
    return Array.isArray(res.data.data) ? res.data.data : []; // ensure it's always an array
  };
  
