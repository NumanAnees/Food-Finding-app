const Link = require("../models/link");
const slugify = require("slugify");
const Category = require("../models/category");
const User = require("../models/user");

exports.create = async (req, res) => {
  const { title, url, category, price, gst } = req.body;
  const slug = slugify(url);
  var check = false;
  await Link.find({ category })
    .populate("category", "name, slug")
    .exec((err, resp) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Could not add new Location",
        });
      }
      if (resp.length > 0) {
        resp.map((e) => {
          if (e.title == title || e.url == url) {
            check = true;
          }
        });
      }
      if (!check) {
        const link = new Link({ title, url, category, slug, price, gst });
        // posted by user
        link.postedBy = req.user._id;
        // save link
        link.save((err, data) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              error: "Could not add new Location",
            });
          }
          res.json(data);
        });
      } else {
        return res.status(400).json({
          error: "Location already present",
        });
      }
    });
};

exports.list = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  const { category } = req.params;
  Link.find({ category })
    .populate("postedBy", "name")
    .populate("category", "name, slug")
    .sort({ clicks: -1 })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Could not list links",
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
        error: "Error finding link",
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, url, category, price, gst } = req.body;
  const updatedLink = { title, url, category, price, gst };

  Link.findOneAndUpdate({ _id: id }, updatedLink, { new: true }).exec(
    (err, updated) => {
      if (err) {
        return res.status(400).json({
          error: "Error updating the link",
        });
      }
      res.json(updated);
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;
  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error removing the link",
      });
    }
    res.json({
      message: data,
    });
  });
};

exports.clickCount = (req, res) => {
  const { linkId } = req.body;
  Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, { new: true }).exec(
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Could not update view count",
        });
      }
      res.json(result);
    }
  );
};

exports.upvote = (req, res) => {
  const { linkId, userId } = req.body;
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { upvotes: 1 }, $push: { upvoteIDs: userId } },
    { upsert: true, new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Could not update upvote count",
      });
    }
    res.json(result);
  });
};

exports.downvote = (req, res) => {
  const { linkId, userId } = req.body;
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { upvotes: -1 }, $pull: { upvoteIDs: userId } },
    { upsert: true, new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Could not update upvote count",
      });
    }
    res.json(result);
  });
};

exports.popular = (req, res) => {
  Link.find()
    .populate("postedBy", "name")
    .populate("category", "name")
    .sort({ upvotes: -1 })
    .limit(10)
    .exec((err, links) => {
      if (err) {
        return res.status(400).json({
          error: "Links not found",
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
        error: "Could not load categories",
      });
    }

    Link.find({ category: category })
      .sort({ clicks: -1 })
      .limit(3)
      .exec((err, links) => {
        if (err) {
          return res.status(400).json({
            error: "Links not found",
          });
        }
        res.json(links);
      });
  });
};

// //get all links posted by a user with matching idParams and also give me the postion of each link in its category if we sort by upvotes
// exports.listByUser = async (req, res) => {
//   try {
//     const requestedUser = await User.findOne({ _id: req.params.id });
//     if (!requestedUser) {
//       return res.status(400).json({
//         error: "User not found",
//       });
//     }
//     //find all links posted by this user and save in a variable;
//     const allLinks = await Link.find({ postedBy: req.params.id })
//       .populate("category", "name")
//       .sort({ upvotes: -1 });
//     //apply a function to each link in the array and add a new property called position by category ranked by upvotes
//     const allLinksRanked = allLinks.map((link) => {
//       const category = link.category._id;
//       Link.find({ category: category })
//         .sort({ upvotes: -1 })
//         .exec((err, links) => {
//           if (err) {
//             console.log(err);
//           }
//           const position = links.findIndex(
//             (element) => element._id.toString() === link._id.toString()
//           );
//           link.position = position + 1;
//           console.log(link);
//           return link;
//         });
//     });
//     res.json({ Links: allLinksRanked, User: requestedUser });
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.listByUser = async (req, res) => {
  try {
    const requestedUser = await User.findOne({ _id: req.params.id });
    if (!requestedUser) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const allLinks = await Link.find({ postedBy: req.params.id })
      .populate("category", "name")
      .sort({ upvotes: -1 });

    const allLinksRanked = await Promise.all(
      allLinks.map(async (link) => {
        const category = link.category._id;
        const linksInCategory = await Link.find({ category: category })
          .sort({ upvotes: -1 })
          .exec();

        const position = linksInCategory.findIndex(
          (element) => element._id.toString() === link._id.toString()
        );

        link.position = position + 1;
        return link;
      })
    );
    //if current user is following the requested user, add a property to the requested user object called following and set it to true
    let isFollowing = false;
    if (
      requestedUser.followers.some(
        (follower) => follower.toString() === req.user._id.toString()
      )
    ) {
      isFollowing = true;
    }

    res.json({
      Links: allLinksRanked,
      User: requestedUser,
      followers: requestedUser.followers.length,
      following: requestedUser.following.length,
      TotalLinks: allLinksRanked.length,
      isFollowing,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

//add new review of a link
exports.addReview = async (req, res) => {
  const linkId = req.params.id;
  const { text, rating } = req.body;
  try {
    //find link by id and populate reviews by createdBy
    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(400).json({
        error: "Link not found",
      });
    }
    //check if user has already reviewed this link
    const alreadyReviewed = link.reviews.find((review) => {
      return review.createdBy.toString() === req.user._id.toString();
    });
    if (alreadyReviewed) {
      return res.status(200).json({
        error: "You have already reviewed this link",
      });
    }

    const newReview = {
      text,
      rating,
      createdBy: req.user._id,
    };
    link.reviews.push(newReview);
    link.save();
    res.json(link);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

//get all reviews of a link
exports.getReviews = async (req, res) => {
  const linkId = req.params.id;
  try {
    const link = await Link.findById(linkId)
      .populate("reviews.createdBy", "name picture")
      .exec();
    if (!link) {
      return res.status(400).json({
        error: "Link not found",
      });
    }
    res.json(link.reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

//delete a review of a link
exports.deleteReview = async (req, res) => {
  const linkId = req.params.id;
  const reviewId = req.params.reviewId;
  try {
    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(400).json({
        error: "Link not found",
      });
    }
    const review = link.reviews.find((review) => {
      return review._id.toString() === reviewId.toString();
    });
    if (!review) {
      return res.status(400).json({
        error: "Review not found",
      });
    }
    if (review.createdBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        error: "You are not authorized to delete this review",
      });
    }
    const index = link.reviews.indexOf(review);
    link.reviews.splice(index, 1);
    link.save();
    res.json(link);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
