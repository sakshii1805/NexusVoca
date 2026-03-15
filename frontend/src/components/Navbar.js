import { FaSearch, FaBell, FaEnvelope, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className="navbar">
      <div className="logo">
        <div className="logoCircle">NV</div>
        <b>Nexus Voca</b>
      </div>

      <div className="navIcons">

        <Link to="/search">
          <FaSearch className="icon" />
        </Link>

        <Link to="/notifications">
          <FaBell className="icon" />
        </Link>

        <Link to="/inbox">
          <FaEnvelope className="icon" />
        </Link>

        <Link to="/profile">
          <FaUserCircle className="icon" />
        </Link>

        {/* Dark / Light toggle */}
        <button className="themeToggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun className="icon" /> : <FaMoon className="icon" />}
        </button>

      </div>
    </div>
  );
}

export default Navbar;
