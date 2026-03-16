const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const { requireAdmin } = require("../middleware/requireAdmin");

router.get("/analytics", requireAdmin, async (_req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();

    const grouped = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const issuesByCategory = {
      hostel: 0,
      mess: 0,
      classroom: 0,
      network: 0,
    };

    for (const row of grouped) {
      const key = String(row._id || "").toLowerCase();
      if (key in issuesByCategory) issuesByCategory[key] = row.count;
    }

    const topIssues = await Issue.find()
      .sort({ votes: -1, createdAt: -1 })
      .limit(5)
      .select("title votes");

    res.json({
      totalIssues,
      issuesByCategory,
      topIssues,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
