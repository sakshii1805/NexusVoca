const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  sender:         { type: String, required: true },
  senderRole:     { type: String, default: "student" },
  text:           { type: String, required: true },
  readBy:         [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);