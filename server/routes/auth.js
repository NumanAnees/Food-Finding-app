const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');


//validators
const {userRegisterValidator,userLoginValidator} = require("../validators/auth");
const {runValidation} = require("../validators")

//controllers
const {register,login} = require("../controllers/auth")


router.post('/register',userRegisterValidator,runValidation,register);
router.post('/login',userLoginValidator,runValidation,login);


module.exports = router; 