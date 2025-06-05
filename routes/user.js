
const {User} = require("../Data/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-password_hash -__v ");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password_hash -__v ");
  if (!user) {
    res.status(500).json({ message: "The category with the given ID was not found." });
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
    return res.status(500).send("The user cannot be created");
  }
  res.send(user);
});

router.delete(`/:id`, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id).select("-password_hash -__v ");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({ success: true, message: "The user is deleted" });
});

router.put(`/:id`, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    { new: true }
  );
  if (!user) {
    return res.status(500).send("The user cannot be updated");
  }
  res.send(user);
} );

module.exports = router;