import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Feed from "./components/Feed";
import Complaint from "./components/Complaint";
import Announcements from "./components/Announcements";

import Search from "./pages/Search";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Trending from "./components/Trending";

import "./App.css";

function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="mainLayout">
        <Sidebar />

        <div className="content">
          {children}
        </div>

        <Trending />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Feed />
            </DashboardLayout>
          }
        />

        <Route
          path="/complaint"
          element={
            <DashboardLayout>
              <Complaint />
            </DashboardLayout>
          }
        />

        <Route
          path="/announcements"
          element={
            <DashboardLayout>
              <Announcements />
            </DashboardLayout>
          }
        />

        <Route
          path="/search"
          element={
            <DashboardLayout>
              <Search />
            </DashboardLayout>
          }
        />

        <Route
          path="/inbox"
          element={
            <DashboardLayout>
              <Inbox />
            </DashboardLayout>
          }
        />

        <Route
          path="/chat/:name"
          element={
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;