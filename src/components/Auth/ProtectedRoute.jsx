import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const lastActivity = localStorage.getItem("lastActivity");
  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms

  useEffect(() => {
    const checkInactivity = () => {
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity, 10);

        if (inactiveTime > INACTIVITY_LIMIT) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authEmail");
          localStorage.removeItem("lastActivity");
          window.location.href = "/login"; // full reload to reset state
        }
      }
    };

    // Run once on mount
    checkInactivity();

    // Re-run periodically (e.g., every minute)
    const interval = setInterval(checkInactivity, 60 * 1000);

    return () => clearInterval(interval);
  }, [lastActivity]);

  // Redirect immediately if not authenticated
  if (!token || !lastActivity || Date.now() - parseInt(lastActivity, 10) > INACTIVITY_LIMIT) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authEmail");
    localStorage.removeItem("lastActivity");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
