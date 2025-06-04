const {Shipping} = require("../Data/shipping");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const shippingList = await Shipping.find();

  if (!shippingList) {
    res.status(500).json({ success: false });
  }
  res.send(shippingList);
});

router.post(`/`, async (req, res) => {
  const shipping = new Shipping({
    user_id: req.body.user_id,
    address: req.body.address,
    city: req.body.city,
    postal_code: req.body.postal_code,
    country: req.body.country,
    shipping_method: req.body.shipping_method,
  });
  shipping = await shipping.save();
  if (!shipping) {
    return res.status(500).send("The shipping cannot be created");
  }
  res.send(shipping);
});

module.exports = router;