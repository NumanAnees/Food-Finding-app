const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "Subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
    isConfirm: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      trim: true,
      max: 256,
    },
    picture: {
      type: String,
      default:
        "https://free.toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
    },
    document: {
      type: String,
      default: "https://via.placeholder.com/150x150.png?text=Document",
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    // create temp variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods > authenticate, encryptPassword, makeSalt
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};
// export user model

module.exports = mongoose.model("User", userSchema);
