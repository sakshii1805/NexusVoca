const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// GET announcements
router.get("/", async (req, res) => {
  try{
    const announcements = await Announcement.find();
    res.json(announcements);
  }catch(err){
    res.status(500).json(err);
  }
});

// POST announcement
router.post("/", async (req, res) => {
  try{
    const newAnnouncement = new Announcement(req.body);
    await newAnnouncement.save();
    res.json(newAnnouncement);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;