const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type:       { type: String, enum: ["post", "user"], required: true },
  targetId:   { type: String, required: true },
  targetName: { type: String, default: "" },
  reporter:   { type: String, required: true },
  reason:     { type: String, required: true },
  resolved:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);