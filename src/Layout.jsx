import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col h-full">
        <Topbar toggleSidebar={toggleSidebar} />

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
