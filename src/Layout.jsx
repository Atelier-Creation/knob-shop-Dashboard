// Layout.jsx
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="bg-[#FAFDFD] rounded-2xl my-3 me-2 h-full overflow-y-auto scrollbar-thick">
          <main className="p-6 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
