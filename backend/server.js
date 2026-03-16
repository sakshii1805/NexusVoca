const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Post = require("./models/Post");
const Comment = require("./models/Comment");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/nexusvoca")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* SIGNUP */
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, role, department } = req.body;

    if (!username || !email || !password || !role) {
      return res.json({ success: false, message: "Please fill in all fields." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({ success: false, message: "Username or email already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      department: role === "student" ? department : "",
    });

    await newUser.save();

    res.json({
      success: true,
      user: {
        name: newUser.username,
        role: newUser.role,
        email: newUser.email,
        department: newUser.department,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username, email });
    if (!user) {
      return res.json({ success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      user: {
        name: user.username,
        role: user.role,
        email: user.email,
        department: user.department,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* CREATE POST */
app.post("/api/posts", async (req, res) => {
  try {
    const { author, role, text } = req.body;
    const newPost = new Post({ author, role, text, likes: 0 });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET POSTS */
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* LIKE POST */
app.post("/api/posts/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE POST */
app.delete("/api/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADD COMMENT */
app.post("/api/posts/:id/comment", async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.params.id,
      author: req.body.author,
      text: req.body.text,
    });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET COMMENTS */
app.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("Backend working"));

app.listen(5000, () => console.log("Server running on port 5000"));