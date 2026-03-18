const express = require("express");
const router  = express.Router();
const Issue   = require("../models/Issue");
const User    = require("../models/User");
const Post    = require("../models/Post");
const Report  = require("../models/Report");
const { requireAdmin } = require("../middleware/requireAdmin");

/* ── ANALYTICS ── */
router.get("/analytics", requireAdmin, async (_req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const grouped = await Issue.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    const issuesByCategory = { hostel:0, mess:0, classroom:0, network:0 };
    for (const row of grouped) {
      const key = String(row._id||"").toLowerCase();
      if (key in issuesByCategory) issuesByCategory[key] = row.count;
    }
    const topIssues = await Issue.find().sort({ votes:-1, createdAt:-1 }).limit(5).select("title votes");
    res.json({ totalIssues, issuesByCategory, topIssues });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── GET ALL USERS ── */
router.get("/users", requireAdmin, async (_req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt:-1 });
    res.json(users);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── DELETE USER ── */
router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── GET ALL REPORTS ── */
router.get("/reports", requireAdmin, async (_req, res) => {
  try {
    const reports = await Report.find({ resolved: false }).sort({ createdAt:-1 });
    res.json(reports);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── RESOLVE REPORT ── */
router.post("/reports/:id/resolve", requireAdmin, async (req, res) => {
  try {
    await Report.findByIdAndUpdate(req.params.id, { resolved: true });
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── DELETE REPORTED POST ── */
router.delete("/reports/:id/delete-post", requireAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report?.type === "post") await Post.findByIdAndDelete(report.targetId);
    await Report.findByIdAndUpdate(req.params.id, { resolved: true });
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;