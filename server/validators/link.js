const { check } = require('express-validator');

exports.linkCreateValidator = [
    check('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    check('url')
        .not()
        .isEmpty()
        .withMessage('URL is required'),
    check('category')
        .not()
        .isEmpty()
        .withMessage('Pick a category'),
    check('price')
        .not()
        .isEmpty()
        .withMessage('Please mention price'),
    check('gst')
        .not()
        .isEmpty()
        .withMessage('Please mention GST'),
];

exports.linkUpdateValidator = [
    check('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    check('url')
        .not()
        .isEmpty()
        .withMessage('URL is required'),
    check('category')
        .not()
        .isEmpty()
        .withMessage('Pick a category'),
    check('price')
        .not()
        .isEmpty()
        .withMessage('Please mention price'),
    check('gst')
        .not()
        .isEmpty()
        .withMessage('Please mention GST'),
];
