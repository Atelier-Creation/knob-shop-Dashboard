import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import { isTokenValid } from "./utils/authUtils";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      if (!isTokenValid()) {
        console.log("Token expired during active session. Logging out.");
        localStorage.removeItem("authUser");
        localStorage.removeItem("authEmail");
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    const interval = setInterval(checkToken, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Example: Navigate to a page based on search
    if (query.toLowerCase() === "homepage ads") {
      navigate("/homepage-ads");
    }
    // else you could navigate to a generic search results page
    // navigate(`/search?query=${query}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col h-full">
        <Topbar toggleSidebar={toggleSidebar} onSearch={handleSearch} />

        <div className="flex-1 overflow-y-auto bg-[#FAFDFD] rounded-2xl my-3 scrollbar-thick">
          <main className="p-6 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
