import { FaHome, FaUserFriends } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../Hooks/useAuth";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === `/${path.toLowerCase()}`;

  const handleNavigation = (destination) => {
    console.log(`Navigating to ${destination}`);
    navigate(`/${destination.toLowerCase()}`);
  };
  return (
    <div className="sidebar">
      <div>
        <ul>
          <li
            onClick={() => handleNavigation("")}
            className={isActive("") ? "active" : ""}
          >
            <FaHome /> Home
          </li>
          <li
            onClick={() => handleNavigation("Notifications")}
            className={isActive("Notifications") ? "active" : ""}
          >
            <MdNotificationsActive /> Notifications
          </li>
          <li onClick={() => handleNavigation("Friends")}>
            <FaUserFriends /> Friends
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        {!loading && user && (
          <div className="sidebar-footer">
            <img src={user.profilePicture} alt={user.name} />
            <p>{user.fullName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
