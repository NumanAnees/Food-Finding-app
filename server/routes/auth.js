const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');


//validators
const {userRegisterValidator,userLoginValidator} = require("../validators/auth");
const {runValidation} = require("../validators")

//controllers
const {register,login,requireSignin} = require("../controllers/auth")

router.post('/register',userRegisterValidator,runValidation,register);
router.post('/login',userLoginValidator,runValidation,login);
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         data: 'This is secret page for logged in users only'
//     });
// });



module.exports = router; 