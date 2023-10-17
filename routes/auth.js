const express = require("express");
const { check, validationResult } = require("express-validator");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/Users");
const JWT_secret = "harryisagoodb$oy"
const fetchuser = require('../middleware/fetchuser')



//create a user using port : http://localhost:5000/api/auth/createuser
router.post(
  "/createuser",
  [
    check("name", "please enter a valid name ").isLength({ min: 3 }),
    check("email", "this is an invalid email").isEmail(),
    check("password", "password should be atleast 5 charecter").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
      }

      let newUser = await User.findOne({ email: req.body.email });
      if (newUser) {
        return res.status(400).json({success, error: "Email is already in use" });
      }
        const salt = await bcrypt.genSalt(10)
        let  secPass = await bcrypt.hash(req.body.password, salt);
      newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      });
      // await newUser.save();
      const data = {
        newUser:{
          id: User.id
        }
      }
      const token = jwt.sign(data,JWT_secret);
      success = true;
      res.json({success,token})
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);



//Authintication a user using : http://localhost:5000/api/auth/login .......no login required

router.post(
  "/login",
  [
    check("email", "this is an invalid email").isEmail(),
    check("password", "password cannot be blank").exists()
  ],
  async (req, res) => {
   let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
    }
    const {password, email} =req.body;

    try{
      let user = await User.findOne({email})
      if(!user){
        return res.status(400).json({success, error:'please try to login with correct credentials'})
      }
      const passwordcompare =  await bcrypt.compare(password,user.password)
      if(!passwordcompare){
        return res.status(400).json({success, error:'please try to login with correct credentials'})
      }

        const data = {
          user:{
            id: user.id
          }
        }
        const token = jwt.sign(data,JWT_secret);
        success = true
        res.json({success, token})
         

    }catch(error){
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  })


  //get loggedin user details using : post '/api/auth/getuser' . login required

  router.post("/getuser",fetchuser, async (req, res) => {
      try{
        const  userid = req.user.id
        const user =  await User.findById(userid).select('-password')
        res.send(user)
      }catch(error){
        console.error(error);
      res.status(500).send("Internal Server Error");
      }
    })


module.exports = router;
