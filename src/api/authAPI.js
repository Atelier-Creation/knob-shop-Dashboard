import axiosInstance from "./axiosInstance";
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/auth`;
const Front_BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/user/auth`;

export const forgotPassword = async (data) => {
  const res = await axios.post(`${BASE_URL}/forgot-password`, data);
  return res.data;
};
// Login user and get JWT token
export const login = (data) => {
  return axiosInstance.post("api/auth/login", data);
};


export const getUserById = async (userId) => {
  try {
    const res = await axios.get(`${Front_BASE_URL}/${userId}`);
    return res.data; // contains { user: { ... } }
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch user" };
  }
};

// Reset password using OTP
export const resetPassword = async (data) => {
  const res = await axios.post(`${BASE_URL}/reset-password`, data);
  return res;
};