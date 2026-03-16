const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const announcementRoutes = require("./routes/announcementRoutes");
const issueRoutes = require("./routes/issueRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/nexusvoca")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* LOGIN */
app.post("/api/login", (req, res) => {
  const { username, email, password } = req.body;
  const users = [
    { username:"rahul",           email:"rahul@college.edu",  password:"password",   name:"Rahul Kumar", role:"student" },
    { username:"priya",           email:"priya@college.edu",  password:"password",   name:"Priya",       role:"student" },
    { username:"ramesh.teacher",  email:"ramesh@college.edu", password:"teacher123", name:"Dr. Ramesh",  role:"teacher" },
    { username:"admin",           email:"admin@college.edu",  password:"admin123",   name:"Admin",       role:"admin" }
  ];
  const user = users.find(u => u.username===username && u.email===email && u.password===password);
  if(user){
    // Email acts as a stable internal identifier for issue reporting/audit.
    res.json({ success:true, user:{ name:user.name, role:user.role, email:user.email } });
  } else {
    res.json({ success:false });
  }
});

// Campus Pulse – Smart Campus Issue Reporting System
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);

// Existing feature (kept): announcements
app.use("/api/announcements", announcementRoutes);

app.get("/", (req, res) => res.send("Backend working"));

app.listen(5000, () => console.log("Server running on port 5000"));