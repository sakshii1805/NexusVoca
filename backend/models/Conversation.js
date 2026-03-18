const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  type:       { type: String, enum: ["dm", "group"], default: "dm" },
  name:       { type: String, default: "" },
  members:    [{ type: String }],
  lastMessage:{ type: String, default: "" },
  lastTime:   { type: Date, default: Date.now },
  createdBy:  { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);