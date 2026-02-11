import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add request interceptor to attach token from localStorage dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("❌ No auth token found in localStorage");
  }
  return config;
});

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if the error is from the login page itself (invalid credentials)
      if (error.config.url && error.config.url.includes("login")) {
        return Promise.reject(error);
      }

      console.log("❌ Token expired or unauthorized. Logging out...");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authEmail");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
