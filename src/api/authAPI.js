import axiosInstance from "./axiosInstance";
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URI}/auth`;


export const forgotPassword = async (data) => {
  const res = await axios.post(`${BASE_URL}/forgot-password`, data);
  return res.data;
};
// Login user and get JWT token
export const login = (data) => {
  return axiosInstance.post("api/auth/login", data);
};


// Reset password using OTP
export const resetPassword = async (data) => {
  const res = await axios.post(`${BASE_URL}/reset-password`, data);
  return res;
};