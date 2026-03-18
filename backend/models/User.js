const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:           { type: String, required: true, unique: true, trim: true },
  email:              { type: String, required: true, unique: true, trim: true },
  password:           { type: String, required: true },
  role:               { type: String, enum: ["student", "teacher", "admin"], required: true },
  department:         { type: String, default: "" },
  blockedUsers:       [{ type: String }],
  anonymousByDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);