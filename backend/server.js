const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Post         = require("./models/Post");
const Comment      = require("./models/Comment");
const User         = require("./models/User");
const Complaint    = require("./models/Complaint");
const Message      = require("./models/Message");
const Conversation = require("./models/Conversation");

const announcementRoutes = require("./routes/announcementRoutes");
const issueRoutes        = require("./routes/issueRoutes");
const adminRoutes        = require("./routes/adminRoutes");
const chatRoutes         = require("./routes/chatRoutes");
const userRoutes         = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

mongoose.connect("mongodb://127.0.0.1:27017/nexusvoca")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ── SIGNUP ── */
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, role, department } = req.body;
    if (!username || !email || !password || !role)
      return res.json({ success: false, message: "Please fill in all fields." });
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.json({ success: false, message: "Username or email already taken." });
    const hashed  = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed, role, department: role==="student"?department:"" });
    await newUser.save();
    res.json({ success:true, user:{ name:newUser.username, role:newUser.role, email:newUser.email, department:newUser.department }});
  } catch(err){ console.log(err); res.status(500).json({ success:false, message:"Server error." }); }
});

/* ── LOGIN ── */
app.post("/api/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username, email });
    if (!user) return res.json({ success:false });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success:false });
    res.json({ success:true, user:{ name:user.username, role:user.role, email:user.email, department:user.department }});
  } catch(err){ console.log(err); res.status(500).json({ success:false }); }
});

/* ── POSTS ── */
app.post("/api/posts", upload.single("media"), async (req, res) => {
  try {
    const { author, role, text, isAnonymous } = req.body;
    const mediaUrl  = req.file ? `/uploads/${req.file.filename}` : null;
    const mediaType = req.file ? (req.file.mimetype.startsWith("video")?"video":req.file.mimetype.startsWith("audio")?"audio":"image") : null;
    const post = new Post({ author, role, text, likes:0, mediaUrl, mediaType, isAnonymous: isAnonymous === "true" });
    await post.save();
    res.json(post);
  } catch(err){ res.status(500).json({ error:err.message }); }
});

app.get("/api/posts", async (_req, res) => {
  try { res.json(await Post.find().sort({ createdAt:-1 })); }
  catch(err){ res.status(500).json({ error:err.message }); }
});

app.post("/api/posts/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1; await post.save(); res.json(post);
  } catch(err){ res.status(500).json({ error:err.message }); }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.json({ success:true });
  } catch(err){ res.status(500).json({ error:err.message }); }
});

app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const comment = new Comment({ postId:req.params.id, author:req.body.author, text:req.body.text });
    await comment.save(); res.json(comment);
  } catch(err){ res.status(500).json({ error:err.message }); }
});

app.get("/api/posts/:id/comments", async (req, res) => {
  try { res.json(await Comment.find({ postId:req.params.id }).sort({ createdAt:-1 })); }
  catch(err){ res.status(500).json({ error:err.message }); }
});

/* ── COMPLAINTS ── */
app.post("/api/complaints", async (req, res) => {
  try {
    const { author, role, text, category } = req.body;
    if (!author||!text) return res.status(400).json({ error:"Author and text required." });
    const c = new Complaint({ author, role, text, category });
    await c.save(); res.json(c);
  } catch(err){ res.status(500).json({ error:err.message }); }
});

app.get("/api/complaints", async (_req, res) => {
  try { res.json(await Complaint.find().sort({ createdAt:-1 })); }
  catch(err){ res.status(500).json({ error:err.message }); }
});

app.post("/api/complaints/like/:id", async (req, res) => {
  try {
    const c = await Complaint.findById(req.params.id);
    c.likes += 1; await c.save(); res.json(c);
  } catch(err){ res.status(500).json({ error:err.message }); }
});

app.delete("/api/complaints/:id", async (req, res) => {
  try {
    const { username, role } = req.body;
    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ error:"Not found." });
    if (role!=="admin" && c.author!==username) return res.status(403).json({ error:"Not allowed." });
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success:true });
  } catch(err){ res.status(500).json({ error:err.message }); }
});

/* ── ROUTES ── */
app.use("/api/announcements", announcementRoutes);
app.use("/api/issues",        issueRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/chat",          chatRoutes);
app.use("/api/users",         userRoutes);

app.get("/", (_req, res) => res.send("Backend working"));
app.listen(5000, () => console.log("Server running on port 5000"));