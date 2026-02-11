import { Navigate } from "react-router-dom";

import { isTokenValid } from "../../utils/authUtils";

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    localStorage.removeItem("authToken");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
