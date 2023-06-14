const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//------------------------Review Schema-------------------------

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
  },
  ValueForMoney: {
    type: Number,
    required: true,
  },
  Ambience: {
    type: Number,
    required: true,
  },
  QualityOfService: {
    type: Number,
    required: true,
  },
  Hygiene: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
  },
});

const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    url: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },
    position: {
      type: Number,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      index: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
    },
    gst: {
      type: String,
    },
    clicks: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    upvoteIDs: [{ type: ObjectId, ref: "User" }],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);
