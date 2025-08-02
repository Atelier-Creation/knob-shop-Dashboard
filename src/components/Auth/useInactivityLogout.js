import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useInactivityLogout(timeout = 30 * 60 * 1000) { // 30 mins
  const navigate = useNavigate();

  useEffect(() => {
    const checkInactivity = () => {
      const lastActivity = parseInt(localStorage.getItem("lastActivity") || "0", 10);
      const now = Date.now();

      if (now - lastActivity > timeout) {
        // Expired due to inactivity
        localStorage.removeItem("authToken");
        localStorage.removeItem("authEmail");
        localStorage.removeItem("lastActivity");
        navigate("/login"); // or your login route
      }
    };

    const updateLastActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // Update activity on interaction
    window.addEventListener("click", updateLastActivity);
    window.addEventListener("keydown", updateLastActivity);
    window.addEventListener("scroll", updateLastActivity);
    window.addEventListener("mousemove", updateLastActivity);

    const interval = setInterval(checkInactivity, 60 * 1000); // check every 1 min

    return () => {
      window.removeEventListener("click", updateLastActivity);
      window.removeEventListener("keydown", updateLastActivity);
      window.removeEventListener("scroll", updateLastActivity);
      window.removeEventListener("mousemove", updateLastActivity);
      clearInterval(interval);
    };
  }, [navigate, timeout]);
}
