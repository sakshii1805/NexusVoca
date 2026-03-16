const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const { categorizeIssue } = require("../utils/categorizeIssue");
const { requireAdmin } = require("../middleware/requireAdmin");

function normalizeCategory(category) {
  if (!category) return "";
  return String(category).trim().toLowerCase();
}

/* CREATE ISSUE (anonymous to UI) */
router.post("/", async (req, res) => {
  try {
    const { title, description, location } = req.body;
    let { category } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "title, description, location are required" });
    }

    category = normalizeCategory(category);
    if (!category) category = categorizeIssue({ title, description, location });

    // Stored internally, but not returned (model toJSON strips it).
    const userId = req.header("x-user-email") || req.body.userId || undefined;

    const issue = new Issue({
      userId,
      title,
      description,
      location,
      category,
      votes: 0,
      status: "reported",
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ISSUES (sorted by votes desc) */
router.get("/", async (req, res) => {
  try {
    const category = normalizeCategory(req.query.category);
    const query = category ? { category } : {};

    const issues = await Issue.find(query).sort({ votes: -1, createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* VOTE ISSUE (+1) */
router.post("/:id/vote", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE STATUS (admin) */
router.put("/:id/status", requireAdmin, async (req, res) => {
  try {
    const status = String(req.body.status || "").toLowerCase().trim();
    if (!["reported", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
