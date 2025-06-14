
const {User} = require("../Data/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');



router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-password_hash -__v ");
try {
    res.status(200).json(userList); // 👈 send users to frontend
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password_hash -__v ");
  if (!user) {
    res.status(500).json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

router.post(`/`, async (req, res) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password_hash: bcrypt.hashSync(req.body.password, 7),
    phone: req.body.phone,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
    is_admin: req.body.is_admin,

  });
  user = await user.save();
  if (!user) {
    return res.status(400).send("The user cannot be created");
  }
  res.send(user);
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select('-password_hash -__v');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User successfully deleted', data: user });
  } catch (error) {
    console.error(' Delete user failed:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});



router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.password_hash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            username: req.body.username,
            email: req.body.email,
            password_hash: newPassword,
            phone: req.body.phone,
            is_admin: req.body.is_admin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.post('/login', async (req,res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(400).send('The user not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.is_admin
      },
      secret,
      { expiresIn: '1d' }
    );

    res.status(200).send({
      user: user.email,
      isAdmin: user.is_admin, //  Send this back to frontend
      token: token
    });
  } else {
    res.status(400).send('Password is wrong!');
  }
});


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Username, email, and password are required.");
  }

  const usernameExists = await User.findOne({ username });
  const emailExists = await User.findOne({ email });

  if (usernameExists) {
    return res.status(400).send("Username already exists.");
  }

  if (emailExists) {
    return res.status(400).send("Email already exists.");
  }

  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password_hash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    is_admin: req.body.is_admin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  try {
    user = await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user.");
  }
});



router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})

module.exports = router;