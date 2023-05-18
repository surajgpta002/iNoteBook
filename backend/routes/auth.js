const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');



const JWT_SECRET = 'surajiissjskskskssksk$bot';


//Route - 1  Create a user using : POST "/api/auth/createuser"  No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  //if there are error , return Bad request and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check whether the user with this email already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exits" })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken })

    //Catch error
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
})


// Routes-2 Create a user using : POST "/api/auth/login"  No login required
router.post('/login', [
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password connot be blank').exists(),
], async (req, res) => {

  let sucesss = false;

  //if there are error , return Bad request and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {

    let user = await User.findOne({ email });

    if (!user) {
      sucesss = false;
      return res.status(400).json({ sucesss , error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      sucesss = false;
      return res.status(400).json({ sucesss , error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    sucesss = true;
    res.json({ sucesss , authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }

})

// Routes-3 Get loggedin user details using : POST "/api/auth/getuser"  Login required

router.post('/getuser', fetchuser ,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
})

module.exports = router