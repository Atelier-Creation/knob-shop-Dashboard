import { Navigate } from "react-router-dom";

const isTokenValid = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;

    // Add 2 sec buffer
    return Date.now() < payload.exp * 1000;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    localStorage.removeItem("authToken");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
