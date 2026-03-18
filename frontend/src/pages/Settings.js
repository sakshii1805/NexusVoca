import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaBell, FaLock, FaUserSlash, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const API = "http://localhost:5000";

function Settings({ darkMode, setDarkMode }) {
  const [anonDefault, setAnonDefault]   = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saved, setSaved]               = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsRes, blockedRes] = await Promise.all([
          axios.get(`${API}/api/users/settings/${user.name}`),
          axios.get(`${API}/api/users/blocked/${user.name}`),
        ]);
        setAnonDefault(settingsRes.data.anonymousByDefault);
        setBlockedUsers(blockedRes.data);
      } catch(err){ console.log(err); }
      finally { setLoading(false); }
    };
    load();
  }, [user?.name]);

  const saveAnonSetting = async (val) => {
    setAnonDefault(val);
    try {
      await axios.post(`${API}/api/users/settings/anonymous`, { username: user.name, anonymousByDefault: val });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch(err){ console.log(err); }
  };

  const unblock = async (target) => {
    try {
      await axios.post(`${API}/api/users/unblock`, { username: user.name, unblockTarget: target });
      setBlockedUsers(prev => prev.filter(u => u !== target));
    } catch(err){ console.log(err); }
  };

  return (
    <div className="settingsPage">
      <h2 className="settingsTitle">Settings</h2>

      {/* ── APPEARANCE ── */}
      <div className="settingsSection">
        <h3>Appearance</h3>
        <div className="settingsRow">
          <div className="settingsLeft">
            <div className="settingsIcon">{darkMode ? <FaMoon/> : <FaSun/>}</div>
            <div>
              <div className="settingsLabel">Dark Mode</div>
              <div className="settingsValue">{darkMode ? "On" : "Off"}</div>
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)}/>
            <span className="toggleSlider"/>
          </label>
        </div>
      </div>

      {/* ── PRIVACY ── */}
      <div className="settingsSection">
        <h3>Privacy</h3>
        <div className="settingsRow">
          <div className="settingsLeft">
            <div className="settingsIcon">{anonDefault ? <FaEyeSlash/> : <FaEye/>}</div>
            <div>
              <div className="settingsLabel">Post Anonymously by Default</div>
              <div className="settingsValue">
                {anonDefault ? "Your name is hidden on all posts" : "Your name is shown on posts"}
              </div>
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={anonDefault} onChange={() => saveAnonSetting(!anonDefault)}/>
            <span className="toggleSlider"/>
          </label>
        </div>
        {saved && <div className="settingsSaved">✓ Saved!</div>}
      </div>

      {/* ── BLOCKED USERS ── */}
      <div className="settingsSection">
        <h3>Blocked Users</h3>
        {loading ? (
          <div className="settingsRow"><span style={{fontSize:13,color:"var(--text-muted)"}}>Loading...</span></div>
        ) : blockedUsers.length === 0 ? (
          <div className="settingsRow">
            <span style={{fontSize:13,color:"var(--text-muted)"}}>You haven't blocked anyone.</span>
          </div>
        ) : (
          blockedUsers.map(u => (
            <div key={u} className="settingsRow">
              <div className="settingsLeft">
                <div className="settingsIcon"><FaUserSlash/></div>
                <div>
                  <div className="settingsLabel">{u}</div>
                  <div className="settingsValue">Blocked</div>
                </div>
              </div>
              <button className="unblockBtn" onClick={() => unblock(u)}>Unblock</button>
            </div>
          ))
        )}
      </div>

      {/* ── ACCOUNT ── */}
      <div className="settingsSection">
        <h3>Account</h3>
        <div className="settingsRow">
          <div className="settingsLeft">
            <div className="settingsIcon"><FaLock/></div>
            <div>
              <div className="settingsLabel">Username</div>
              <div className="settingsValue">{user?.name}</div>
            </div>
          </div>
        </div>
        <div className="settingsRow">
          <div className="settingsLeft">
            <div className="settingsIcon"><FaBell/></div>
            <div>
              <div className="settingsLabel">Role</div>
              <div className="settingsValue">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;