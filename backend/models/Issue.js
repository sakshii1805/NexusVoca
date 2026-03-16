const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
  {
    // Stored internally for abuse/audit, but never returned to students UI.
    userId: { type: String, required: false },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // Stored lower-case for consistent filtering/analytics.
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    location: { type: String, required: true, trim: true },

    votes: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["reported", "in_progress", "resolved"],
      default: "reported",
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure author identity is not exposed in API responses.
IssueSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.userId;
    return ret;
  },
});

module.exports = mongoose.model("Issue", IssueSchema);
