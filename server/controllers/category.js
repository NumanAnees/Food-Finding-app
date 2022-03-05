const Category = require('../models/category');
const slugify = require('slugify');
const Link = require('../models/link');


exports.create = (req, res) => {
    const { name, content,url } = req.body;
    const key = Date.now();
    const slug = slugify(name);
    const image = {
        url:`${url}`,
        key: `${key}`
    }
    const category = new Category({ name, slug, image,content });
    category.postedBy = req.user._id;

    category.save((err, data) => {
        if (err) {
            console.log('CATEGORY CREATE ERR', err);
            return res.status(400).json({
                error: 'Category create failed'
            });
        }
        res.json(data);
    });
};

exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories could not load'
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const { slug } = req.params;
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    Category.findOne({ slug })
        .populate('postedBy', '_id name')
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    error: 'Could not load category'
                });
            }
            // res.json(category);
            Link.find({ category: category })
                .populate('postedBy', '_id name')
                .populate('category', 'name')
                .sort({upvotes: -1 })
                .limit(limit)
                .skip(skip)
                .exec((err, links) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Could not load links of a category'
                        });
                    }
                    res.json({ category, links });
                });
        });
};


exports.update = (req, res) => {
    const { slug } = req.params;
    const { name,content,url } = req.body;
    const key = Date.now();
    const image = {
        url:`${url}`,
        key: `${key}`
    }
    Category.findOneAndUpdate({ slug }, { name, content,image }, { new: true }).exec((err, updated) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not find category to update'
            });
        }
            res.json(updated);
    });
};

exports.remove = (req, res) => {
    const { slug } = req.params;
    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not delete category'
            });
        }
        res.json({
            message: 'Category deleted successfully'
        });
    });
};
