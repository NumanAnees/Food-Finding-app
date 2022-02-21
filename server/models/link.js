const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const linkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            max: 256
        },
        url: {
            type: String,
            trim: true,
            required: true,
            max: 256
        },
        slug: {
            type: String,
            lowercase: true,
            required: true,
            index: true
        },
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        category: {
                type: ObjectId,
                ref: 'Category',
                required: true
        },
        price: {
            type: Number,
        },
         gst: {
            type: String,
        },
        clicks: { type: Number, default: 0 },
        upvotes: {type: Number, default: 0 },
        upvoteIDs: [{ type: ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);
