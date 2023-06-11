const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
//-----------------------------Cloudinary---------------------------------
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhghdtteg",
  api_key: "523389569168828",
  api_secret: "c_SYdsF1M5IauIZrA3PASXbdVl0",
});

exports.register = (req, res) => {
  //console.log("reg con",req.body);
  const { name, email, password, phone } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    //upload image to cloudinary
    const imagePath = req.files.picture; //name on postman
    cloudinary.uploader.upload(imagePath.tempFilePath, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        //new user
        const newUser = new User({
          name,
          email,
          password,
          phone,
          picture: result.url,
        });
        newUser.save((err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Try later",
            });
          }
          return res.json({
            message: "Registration success. Please login.",
          });
        });
      }
    });
  });
};

exports.registerRestaurant = (req, res) => {
  //console.log("reg con",req.body);
  const { restaurantName, email, password, location } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    //upload image to cloudinary
    const imagePath = req.files.picture; //name on postman
    cloudinary.uploader.upload(imagePath.tempFilePath, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        //if everything is ok
        const imagePath1 = req.files.document; //name on postman
        cloudinary.uploader.upload(
          imagePath1.tempFilePath,
          (error, result1) => {
            if (error) {
              console.log(error);
            } else {
              console.log("r1", result.url);
              console.log("r2", result1.url);

              //new user
              const newUser = new User({
                name: restaurantName,
                email,
                password,
                location,
                isConfirm: false,
                picture: result.url,
                document: result1.url,
              });
              newUser.save((err, result) => {
                if (err) {
                  clg(err);
                  return res.status(401).json({
                    error: "Error saving restaurant in database. Try later",
                  });
                }
                return res.json({
                  message: "Registration success. Please login.",
                });
              });
            }
          }
        );
      }
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  // console.table({ email, password });
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please register.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    if (user.isConfirm === false) {
      return res.status(400).json({
        error: "Your account is not confirmed yet. Please contact admin.",
      });
    }
    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role, picture } = user;

    return res.json({
      token,
      user: { _id, name, email, role, picture },
    });
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
}); // req.user

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  });
};
