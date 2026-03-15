import { FaHome, FaExclamationCircle, FaBell, FaUsers, FaCog, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/dashboard" className="sidebarItem">
        <FaHome className="sideIcon"/>
        <span>Home</span>
      </Link>

      <Link to="/complaint" className="sidebarItem">
        <FaExclamationCircle className="sideIcon"/>
        <span>Complaints</span>
      </Link>

      <Link to="/announcements" className="sidebarItem">
        <FaBell className="sideIcon"/>
        <span>Announcements</span>
      </Link>

      <Link to="/community" className="sidebarItem">
        <FaUsers className="sideIcon"/>
        <span>Community</span>
      </Link>

      <div className="sidebarDivider"/>

      <Link to="/settings" className="sidebarItem">
        <FaCog className="sideIcon"/>
        <span>Settings</span>
      </Link>

      <Link to="/about" className="sidebarItem">
        <FaInfoCircle className="sideIcon"/>
        <span>About</span>
      </Link>

    </div>
  );
}

export default Sidebar;
