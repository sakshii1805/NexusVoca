import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Complaint from "./components/Complaint";
import Announcements from "./components/Announcements";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Trending from "./components/Trending";

import "./App.css";

function App() {

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Login />} />

<Route path="/dashboard" element={
<>
<Navbar />

<div className="mainLayout">

<Sidebar />

<Feed />

<Trending />

</div>
</>
} />

<Route path="/complaint" element={<Complaint />} />

<Route path="/announcements" element={<Announcements />} />

</Routes>

</BrowserRouter>

);

}

export default App;