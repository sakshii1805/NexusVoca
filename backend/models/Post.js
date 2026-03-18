const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author:      String,
  role:        String,
  text:        String,
  likes:       { type: Number, default: 0 },
  mediaUrl:    { type: String, default: null },
  mediaType:   { type: String, default: null },
  isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);