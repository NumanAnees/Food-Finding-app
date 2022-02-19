const User = require('../models/user');
const Link = require('../models/link');
const crypto = require('crypto');

exports.read = (req, res) => {
    User.findOne({ _id: req.user._id }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        Link.find({ postedBy: req.user._id })
            .populate('category', 'name slug')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 })
            .exec((err, links) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Could not find links'
                    });
                }
                user.hashed_password = undefined;
                user.salt = undefined;
                res.json({ user, links });
            });
    });
};
const encryptPassword = async(password,salt)=>{
    if(!password){
        return "";
    }
      try {
           const hashPwd = crypto
                .createHmac('sha1', salt)
                .update(password)
                .digest('hex');
                console.log("numan 's password",hashPwd);
                return hashPwd;
        } catch (err) {
            return '';
        }
}

exports.update = (req, res) => {
    const { name, password } = req.body;
    switch (true) {
        case password && password.length < 6:
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            break;
    }
    console.log(password);
    User.findById({ _id: req.user._id },(err, updated) => {
        if (err) {
            return res.staus(400).json({
                error: 'Could not find user to update'
            });
        }
        updated.name = name;
        updated.password = password;
        //updated.hashed_password = encryptPassword(password,updated.salt);
        updated.save((err,resp)=>{
            if (err) {
            return res.staus(400).json({
                error: 'Could not find user to update'
            });
        }
        console.log("Profile updated")
        });
        console.log(updated);
        res.json(updated);
    });
};
