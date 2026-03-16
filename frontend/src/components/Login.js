import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username, email, password,
      });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError("Incorrect credentials. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">

        <div className="authIconWrap">👋</div>
        <h2 className="authHeading">Welcome back!</h2>
        <p className="authSubhead">Good to see you again.<br />Sign in to your campus.</p>

        <div className="authBadge">
          <div className="authBadgeDot" />
          <span>Campus is live</span>
        </div>

        {error && <p className="authError">{error}</p>}

        <div className="authFields">
          <div className="authField">
            <label className="authLabel">Username</label>
            <input
              className="authInput"
              type="text"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />
          </div>
          <div className="authField">
            <label className="authLabel">College email</label>
            <input
              className="authInput"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="authField">
            <label className="authLabel">Password</label>
            <input
              className="authInput"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        <button className="authBtn" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="authSpinner" /> : <>Sign in ✦</>}
        </button>

        <p className="authSwitch">
          New here?{" "}
          <Link to="/signup" className="authSwitchLink">Create an account</Link>
        </p>

        <div className="authFooter">
          <span>🔒</span>
          <span>Secured with your college credentials</span>
        </div>

      </div>
    </div>
  );
}

export default Login;