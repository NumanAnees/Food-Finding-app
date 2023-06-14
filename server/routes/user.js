const express = require("express");
const router = express.Router();

// import middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");
// import validator
const { userUpdateValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

// import controllers
const {
  read,
  update,
  googleAuth,
  Pendingrestaurants,
  confirmRestaurant,
  followUser,
  unfollowUser,
  getStats,
} = require("../controllers/user");

// routes
router.get("/user", requireSignin, authMiddleware, read);
router.get("/admin", requireSignin, adminMiddleware, read);
router.put(
  "/user",
  userUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  update
);
router.post("/user/google-auth", googleAuth);
router.get("/user/Pendingrestaurants", Pendingrestaurants);
router.put("/user/confirmRestaurant/:id", confirmRestaurant);
router.put("/user/follow", requireSignin, followUser);
router.put("/user/unfollow", requireSignin, unfollowUser);
router.get("/user/stats", getStats);

module.exports = router;
