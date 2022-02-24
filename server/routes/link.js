const express = require('express');
const router = express.Router();

// validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

// controllers
const { requireSignin, authMiddleware,adminMiddleware} = require('../controllers/auth');
const { create, list, read, update, remove,clickCount,upvote,downvote,popular,popularInCategory } = require('../controllers/link');

// routes
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddleware, create);
router.post('/links/:category',requireSignin, adminMiddleware,list);
router.put("/click-count",clickCount);
router.put("/upvote",upvote);
router.put("/downvote",downvote);
router.get("/link/popular",popular);
router.get("/link/popular/:slug",popularInCategory);
router.get('/link/:id', read);
router.put('/link/:id', linkUpdateValidator, runValidation, requireSignin, authMiddleware, update);
router.delete('/link/:id', requireSignin, authMiddleware, remove);

module.exports = router;
