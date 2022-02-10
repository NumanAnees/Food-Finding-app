const User = require("../models/user")

exports.register =(req, res) => {
  //console.log("reg con",req.body);
  const {name,email,password,} = req.body;
  User.findOne({email}).exec((err,user)=>{
    if(user){
      return res.status(400).json({
        error:"Email is taken"
      })
    }
     //new user
     const newUser = new User({name,email,password});
      newUser.save((err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: 'Error saving user in database. Try later'
                    });
                }
                return res.json({
                    message: 'Registration success. Please login.'
                });
            });
    })
    
} 