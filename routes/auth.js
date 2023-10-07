// const express = require('express')

// const router = express.Router();
// const User = require('../models/Users')

// router.post('/', async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email is already in use' });
//     }

//     const user = new User(req.body);
//     await user.save();
//     res.send(req.body);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// module.exports = router
const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();
const User = require("../models/Users");
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let newUser = await User.findOne({ email: req.body.email });
      if (newUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
