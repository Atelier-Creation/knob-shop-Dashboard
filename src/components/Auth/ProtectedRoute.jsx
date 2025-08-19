import { Navigate } from "react-router-dom";

const isTokenValid = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    localStorage.removeItem("authToken"); // clear invalid/expired token
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
