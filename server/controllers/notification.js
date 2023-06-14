const { insertMany } = require("../models/link");
const notification = require("../models/notification");
const moment = require("moment");

exports.addNotification = async (body) => {
  try {
    const { notifier, receiver, message, category } = body;
    const data = await notification.create({
      notifier,
      receiver,
      message,
      category,
    });
    return data;
  } catch (ex) {
    console.log("ex", ex);
  }
};

//get all notification of a reciever logged in wihh seen false
exports.getNotificationUnseen = async (req, res) => {
  try {
    const id = req.user._id;
    let data = await notification
      .find({ receiver: id, seen: false })
      .sort({ createdAt: -1 })
      .populate("notifier", "picture");
    if (data) {
      //filter data to get only the fields we need of message and seen
      data = data.map((item) => {
        return {
          message: item.message,
          image: item.notifier.picture
            ? item.notifier.picture
            : "https://free.toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
          detailPage: `/user/${item.notifier._id}`,
          receivedTime: moment(item.createdAt).fromNow(),
          _id: item._id,
        };
      });

      return res.send(data).status(200);
    } else return res.send(false).status(400);
  } catch (ex) {
    console.log("ex", ex);
  }
};

//seen true of a notification of a user given by req.params
exports.seenNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await notification.updateOne(
      { _id: id },
      { $set: { seen: true } }
    );
    if (data) return res.send(true).status(200);
    else return res.send(false).status(400);
  } catch (ex) {
    console.log("ex", ex);
  }
};

//set the seen true of all notifications of a user
exports.seenAllNotifications = async (req, res) => {
  try {
    const data = await notification.updateMany(
      { receiver: req.body.userId },
      { $set: { seen: true } }
    );
    if (data) return res.send([]).status(200);
    else return res.send(false).status(400);
  } catch (ex) {
    console.log("ex", ex);
  }
};
