import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    confirmPassword: "", role: "", department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showDepartment = form.role === "student";

  const handleSignup = async () => {
    setError("");
    const { username, email, password, confirmPassword, role, department } = form;
    if (!username || !email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }
    if (role === "student" && !department) {
      setError("Please enter your department.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        username, email, password, role,
        department: role === "student" ? department : "",
      });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Signup failed. Please try again.");
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
      <div className="authCard authCard--wide">

        <div className="authIconWrap">🎓</div>
        <h2 className="authHeading">Join your campus!</h2>
        <p className="authSubhead">Create your account and start connecting<br />with your college community.</p>

        <div className="authDots">
          <div className="authDot authDot--active" />
          <div className="authDot" />
          <div className="authDot" />
        </div>

        {error && <p className="authError">{error}</p>}

        <div className="authFields">
          <div className="authRow">
            <div className="authField">
              <label className="authLabel">Username</label>
              <input
                className="authInput"
                type="text"
                name="username"
                placeholder="pick a username"
                value={form.username}
                onChange={handleChange}
                autoFocus
              />
            </div>
            <div className="authField">
              <label className="authLabel">Role</label>
              <select
                className="authInput authSelect"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="authField">
            <label className="authLabel">College email</label>
            <input
              className="authInput"
              type="email"
              name="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {showDepartment && (
            <div className="authField">
              <label className="authLabel">Department</label>
              <input
                className="authInput"
                type="text"
                name="department"
                placeholder="e.g. Computer Science"
                value={form.department}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="authRow">
            <div className="authField">
              <label className="authLabel">Password</label>
              <input
                className="authInput"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="authField">
              <label className="authLabel">Confirm password</label>
              <input
                className="authInput"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <button className="authBtn" onClick={handleSignup} disabled={loading}>
          {loading ? <span className="authSpinner" /> : <>Create account ✦</>}
        </button>

        <p className="authSwitch">
          Already registered?{" "}
          <Link to="/" className="authSwitchLink">Sign in</Link>
        </p>

        <div className="authFooter">
          <span>🔒</span>
          <span>Secured with your college credentials</span>
        </div>

      </div>
    </div>
  );
}

export default Signup;