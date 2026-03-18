const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  text:   { type: String, required: true },
  author: { type: String, default: "Admin" },
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);