const User = require("../models/user");
const Link = require("../models/link");
const crypto = require("crypto");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.read = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    Link.find({ postedBy: req.user._id })
      .populate("category", "name slug")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .exec((err, links) => {
        if (err) {
          return res.status(400).json({
            error: "Could not find links",
          });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ user, links });
      });
  });
};
const encryptPassword = async (password, salt) => {
  if (!password) {
    return "";
  }
  try {
    const hashPwd = crypto
      .createHmac("sha1", salt)
      .update(password)
      .digest("hex");
    console.log("numan 's password", hashPwd);
    return hashPwd;
  } catch (err) {
    return "";
  }
};

exports.update = (req, res) => {
  const { name, password } = req.body;
  switch (true) {
    case password && password.length < 6:
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      break;
  }
  console.log(password);
  User.findById({ _id: req.user._id }, (err, updated) => {
    if (err) {
      return res.staus(400).json({
        error: "Could not find user to update",
      });
    }
    updated.name = name;
    updated.password = password;
    //updated.hashed_password = encryptPassword(password,updated.salt);
    updated.save((err, resp) => {
      if (err) {
        return res.staus(400).json({
          error: "Could not find user to update",
        });
      }
      console.log("Profile updated");
    });
    console.log(updated);
    res.json(updated);
  });
};

exports.googleAuth = async (req, res) => {
  try {
    const { jwt_credentials } = req.body;
    const { email, name } = jwtDecode(jwt_credentials);
    //user with email eixist
    const userWithEmail = await User.findOne({ email });
    console.log(userWithEmail);
    if (userWithEmail) {
      //if user already exists
      // generate token and send to client
      // generate token and send to client
      const token = jwt.sign(
        { _id: userWithEmail._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      const { _id, name, email, role } = userWithEmail;
      return res.json({
        token,
        user: { _id, name, email, role },
      });
    } else {
      // if user not exists
      // create new user and save
      const password = "qniqvnq123@";
      const phone = "0310344810";
      const address = "Street 2-A,Lahore";
      const newUser = new User({ name, email, password, phone, address });
      newUser.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "User signup failed with google",
          });
        }
        // generate token and send to client
        const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        const { _id, name, email, role } = result;
        return res.json({
          token,
          user: { _id, name, email, role },
        });
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "unexpected error occured" });
  }
};

//get all users where isConfirm is false
exports.Pendingrestaurants = async (req, res) => {
  try {
    const users = await User.find({ isConfirm: false });
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "unexpected error occured" });
  }
};

//update isConfirm to true
exports.confirmRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    user.isConfirm = true;
    await user.save();
    const users = await User.find({ isConfirm: false });
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "unexpected error occured" });
  }
};
