import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="layout">
      {sidebarOpen && (
        <div className="sidebar-container">
          {" "}
          <Sidebar />
        </div>
      )}
      <div className="navbar-container">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
