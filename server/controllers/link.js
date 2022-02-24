const Link = require('../models/link');
const slugify = require('slugify');
const Category = require('../models/category');
const User = require('../models/user');


exports.create = async(req, res) => {
    const { title, url, category , price, gst } = req.body;
    const slug = slugify(url);
    var check = false;
   await Link.find({category})
    .populate('category', 'name, slug')
    .exec((err,resp)=>{
          if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Could not add new Location'
            });
        }
        if(resp.length>0){
            resp.map((e)=>{
                if(e.title == title || e.url == url){
                    check = true;
                } 
            })
        }
    if (!check){
    const link = new Link({ title, url, category,slug, price, gst });
    // posted by user
    link.postedBy = req.user._id;
    // save link
    link.save((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Could not add new Location'
            });
        }
        res.json(data);
    });
}else{
    return res.status(400).json({
                error: 'Location already present'
            });
}
})
};

exports.list = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    const { category } = req.params;
    Link.find({category})
        .populate('postedBy', 'name')
        .populate('category', 'name, slug')
        .sort({ clicks: -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Could not list links'
                });
            }
            res.json(data);
        });
};

exports.read = (req, res) => {
  const { id } = req.params;
    Link.findOne({ _id: id }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error finding link'
            });
        }
        res.json(data);
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { title, url, category, price, gst } = req.body;
    const updatedLink = { title, url, category, price, gst };

    Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec((err, updated) => {
        if (err) {
            return res.status(400).json({
                error: 'Error updating the link'
            });
        }
        res.json(updated);
    });
};

exports.remove = (req, res) => {
    const { id } = req.params;
    Link.findOneAndRemove({ _id: id }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error removing the link'
            });
        }
        res.json({
            message: data
        });
    });
};


exports.clickCount = (req, res) => {
    const { linkId } = req.body;
    Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, {  new: true }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Could not update view count'
            });
        }
        res.json(result);
    });
};

exports.upvote = (req, res) => {
    const { linkId,userId } = req.body;
    Link.findByIdAndUpdate(linkId, {$inc: { upvotes: 1 },$push:{upvoteIDs:userId}}, { upsert: true ,new: true }).exec((err,result)=>{
        if (err) {
                return res.status(400).json({
                error: 'Could not update upvote count'
                });
            }
        res.json(result);

    })
};

exports.downvote = (req, res) => {
    const { linkId,userId } = req.body;
    Link.findByIdAndUpdate(linkId, { $inc: { upvotes: -1 },$pull:{upvoteIDs:userId}}, { upsert: true, new: true }).exec((err,result)=>{
        if (err) {
                return res.status(400).json({
                error: 'Could not update upvote count'
                });
            }
        res.json(result);

    })
};

exports.popular = (req, res) => {
    Link.find()
        .populate('postedBy', 'name')
        .populate('category', 'name').sort({ upvotes: -1 })
        .limit(3)
        .exec((err, links) => {
            if (err) {
                return res.status(400).json({
                    error: 'Links not found'
                });
            }
            res.json(links);
        });
};

exports.popularInCategory = (req, res) => {
    const { slug } = req.params;
    console.log(slug);
    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not load categories'
            });
        }

        Link.find({ category: category })
            .sort({ clicks: -1 })
            .limit(3)
            .exec((err, links) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Links not found'
                    });
                }
                res.json(links);
            });
    });
};
