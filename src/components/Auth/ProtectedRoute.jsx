import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const expiry = localStorage.getItem("authExpiry");

  useEffect(() => {
    // Check and set up auto-logout timer
    if (expiry) {
      const timeout = parseInt(expiry) - Date.now();

      if (timeout > 0) {
        const timer = setTimeout(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authExpiry");
          window.location.href = "/lockscreen"; // hard redirect to avoid rendering stale state
        }, timeout);

        return () => clearTimeout(timer);
      } else {
        // Expired already
        localStorage.removeItem("authToken");
        localStorage.removeItem("authExpiry");
        window.location.href = "/login";
      }
    }
  }, [expiry]);

  if (!token || !expiry || Date.now() > parseInt(expiry)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authExpiry");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
