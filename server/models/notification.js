const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    notifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["upvoted", "reviewed", "added", "updated", "created", "deleted"],
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notification", NotificationSchema);
