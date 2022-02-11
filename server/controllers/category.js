const Category = require('../models/category');
const slugify = require('slugify');

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
    //
};

exports.update = (req, res) => {
    //
};

exports.remove = (req, res) => {
    //
};
