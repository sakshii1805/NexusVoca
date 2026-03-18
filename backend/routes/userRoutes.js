const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const Report  = require("../models/Report");

/* ── BLOCK a user ── */
router.post("/block", async (req, res) => {
  try {
    const { username, blockTarget } = req.body;
    await User.findOneAndUpdate(
      { username },
      { $addToSet: { blockedUsers: blockTarget } }
    );
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── UNBLOCK a user ── */
router.post("/unblock", async (req, res) => {
  try {
    const { username, unblockTarget } = req.body;
    await User.findOneAndUpdate(
      { username },
      { $pull: { blockedUsers: unblockTarget } }
    );
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── GET blocked list ── */
router.get("/blocked/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("blockedUsers");
    res.json(user?.blockedUsers || []);
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── REPORT a post or user ── */
router.post("/report", async (req, res) => {
  try {
    const { type, targetId, targetName, reporter, reason } = req.body;
    if (!type || !targetId || !reporter || !reason)
      return res.status(400).json({ error: "Missing required fields." });
    const report = new Report({ type, targetId, targetName, reporter, reason });
    await report.save();
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── GET anonymous setting ── */
router.get("/settings/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("anonymousByDefault");
    res.json({ anonymousByDefault: user?.anonymousByDefault || false });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

/* ── UPDATE anonymous setting ── */
router.post("/settings/anonymous", async (req, res) => {
  try {
    const { username, anonymousByDefault } = req.body;
    await User.findOneAndUpdate({ username }, { anonymousByDefault });
    res.json({ success: true });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;