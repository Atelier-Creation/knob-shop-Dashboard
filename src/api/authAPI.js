import axiosInstance from "./axiosInstance";

// Login user and get JWT token
export const login = (data) => {
  return axiosInstance.post("api/auth/login", data);
};

// Send OTP to email for password reset
export const forgotPassword = (data) => {
  return axiosInstance.post("/auth/forgot-password", data);
};

// Reset password using OTP
export const resetPassword = (data) => {
  return axiosInstance.post("/auth/reset-password", data);
};
