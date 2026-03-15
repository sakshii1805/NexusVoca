import React, { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {

      const res = await axios.post("http://localhost:5000/api/login", {
        username: username,
        email: email,
        password: password
      });

      if (res.data.success) {

        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.href = "/dashboard";

      } else {

        alert("Invalid login");

      }

    } catch (err) {

      console.log(err);
      alert("Server error");

    }
  };

  return (
    <div className="loginPage">

      <div className="loginCard">

        <h2>Nexus Voca</h2>

        <p className="loginSubtitle">
          Campus Communication Platform
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;