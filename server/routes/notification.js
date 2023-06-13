const {
  getNotificationUnseen,
  seenNotification,
  seenAllNotification,
} = require("../controllers/notification");
const router = require("express").Router();

// import middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");

router.get("/getunseen", requireSignin, authMiddleware, getNotificationUnseen);
router.put("/seen/:id", requireSignin, authMiddleware, seenNotification);
router.put("/seenAll", requireSignin, authMiddleware, seenAllNotification);

module.exports = router;
