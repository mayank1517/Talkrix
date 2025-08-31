import useAuth from "../Hooks/useAuth";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import defaultImg from "../assets/default.jpeg";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const handleLogout = () => {
    try {
      axiosInstance.post("/auth/logout").then(() => {
        window.location.reload();
      });

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };
  return (
    <div className="navbar">
      <div>
        <GiHamburgerMenu onClick={toggleSidebar} className="toggle-btn" />
        <h2 style={{ cursor: "pointer", marginLeft: "3rem" }}>Talkrix</h2>
      </div>
      <div className="userActions">
        <div className="userProfile">
          <img src={user?.profilePicture || defaultImg} alt="profile" />
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
