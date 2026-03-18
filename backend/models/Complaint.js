const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  author:   { type: String, required: true },
  role:     { type: String, required: true },
  text:     { type: String, required: true },
  category: { type: String, default: "other" },
  likes:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);