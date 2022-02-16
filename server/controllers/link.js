const Link = require('../models/link');
const slugify = require('slugify');

exports.create = (req, res) => {
    const { title, url, category , price, gst } = req.body;
    const slug = slugify(url);
    const link = new Link({ title, url, category,slug, price, gst });
    // posted by user
    link.postedBy = req.user._id;
    // save link
    link.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Unexpected error occured'
            });
        }
        res.json(data);
    });
};

exports.list = (req, res) => {
    Link.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not list links'
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    //
};

exports.update = (req, res) => {
    //
};

exports.remove = (req, res) => {
    //
};


exports.clickCount = (req, res) => {
    const { linkId } = req.body;
    Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, { upsert: true, new: true }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Could not update view count'
            });
        }
        res.json(result);
    });
};
exports.upvoteCount = (req, res) => {
    const { linkId } = req.body;
    Link.findByIdAndUpdate(linkId, { $inc: { upvotes: 1 } }, { upsert: true, new: true }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Could not update upvote count'
            });
        }
        res.json(result);
    });
};