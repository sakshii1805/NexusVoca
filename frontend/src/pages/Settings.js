import { FaMoon, FaSun, FaBell, FaLock, FaUserCircle, FaEnvelope } from "react-icons/fa";

function Settings({ darkMode, setDarkMode }) {

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Student", email: "student@nexusvoca.com" };

  return (
    <div className="settingsPage">

      <h2 className="settingsTitle">Settings</h2>

      {/* Account */}
      <div className="settingsSection">
        <h3>Account</h3>

        <div className="settingsRow">
          <div className="settingsLeft">
            <FaUserCircle className="settingsIcon" />
            <div>
              <p className="settingsLabel">Name</p>
              <p className="settingsValue">{user.name}</p>
            </div>
          </div>
        </div>

        <div className="settingsRow">
          <div className="settingsLeft">
            <FaEnvelope className="settingsIcon" />
            <div>
              <p className="settingsLabel">Email</p>
              <p className="settingsValue">{user.email || "student@nexusvoca.com"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="settingsSection">
        <h3>Appearance</h3>

        <div className="settingsRow">
          <div className="settingsLeft">
            {darkMode ? <FaMoon className="settingsIcon" /> : <FaSun className="settingsIcon" />}
            <div>
              <p className="settingsLabel">Theme</p>
              <p className="settingsValue">{darkMode ? "Dark Mode" : "Light Mode"}</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="toggleSlider" />
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="settingsSection">
        <h3>Notifications</h3>

        <div className="settingsRow">
          <div className="settingsLeft">
            <FaBell className="settingsIcon" />
            <div>
              <p className="settingsLabel">Push Notifications</p>
              <p className="settingsValue">Get notified about activity</p>
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggleSlider" />
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="settingsSection">
        <h3>Privacy</h3>

        <div className="settingsRow">
          <div className="settingsLeft">
            <FaLock className="settingsIcon" />
            <div>
              <p className="settingsLabel">Private Account</p>
              <p className="settingsValue">Only college members can see your profile</p>
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggleSlider" />
          </label>
        </div>
      </div>

    </div>
  );
}

export default Settings;