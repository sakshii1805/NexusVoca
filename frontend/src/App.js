import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Complaint from "./components/Complaint";
import Announcements from "./components/Announcements";

import Search from "./pages/Search";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import About from "./pages/About";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Trending from "./components/Trending";

import "./App.css";

function Layout({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="mainLayout">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
        <Trending />
      </div>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route path="/dashboard"     element={<Feed />} />
          <Route path="/complaint"     element={<Complaint />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/search"        element={<Search />} />
          <Route path="/inbox"         element={<Inbox />} />
          <Route path="/chat/:name"    element={<Chat />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/community"     element={<Community />} />
          <Route path="/settings"      element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/about"         element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;