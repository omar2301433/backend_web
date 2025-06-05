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

router.get(`/:id`, async (req, res) => {
  const shipping = await Shipping.findById(req.params.id);
  if (!shipping) {
    res.status(500).json({ message: "The shipping with the given ID was not found." });
  }
  res.status(200).send(shipping);
});

router.delete(`/:id`, async (req, res) => {
  const shipping = await Shipping.findByIdAndRemove(req.params.id);
  if (!shipping) {
    return res.status(404).json({ success: false, message: "Shipping not found" });
  }
  return res.status(200).json({ success: true, message: "The shipping is deleted" });
}
);  

router.put(`/:id`, async (req, res) => {
  const shipping = await Shipping.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      address: req.body.address,
      city: req.body.city,
      postal_code: req.body.postal_code,
      country: req.body.country,
      shipping_method: req.body.shipping_method,
    },
    { new: true }
  );

  if (!shipping) {
    return res.status(500).send("The shipping cannot be updated");
  }
  res.send(shipping);
}
);  

module.exports = router;