const {Order} = require("../Data/order");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.post(`/`, async (req, res) => {
  const order = new Order({
    user_id: req.body.user_id,
    order_date: req.body.order_date,
    status: req.body.status,
    items: req.body.items,
    shipping_id: req.body.shipping_id,
    payment_id: req.body.payment_id,
   
  });
 order = await order.save();
  if (!order) {
    return res.status(500).send("The order cannot be created");
  }
  res.send(order);
  
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(500).json({ message: "The order with the given ID was not found." });
  }
  res.status(200).send(order);
});

router.put(`/:id`, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      order_date: req.body.order_date,
      status: req.body.status,
      items: req.body.items,
      shipping_id: req.body.shipping_id,
      payment_id: req.body.payment_id,
    },
    { new: true }
  );

  if (!order) {
    return res.status(500).send("The order cannot be updated");
  }
  res.send(order);
});


module.exports = router;