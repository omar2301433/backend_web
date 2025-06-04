const {Payment} = require("../Data/payment");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const paymentList = await Payment.find();

  if (!paymentList) {
    res.status(500).json({ success: false });
  }
  res.send(paymentList);
});

router.post(`/`, async (req, res) => {
  const payment = new Payment({
    user_id: req.body.user_id,
    payment_method: req.body.payment_method,
    payment_status: req.body.payment_status,
    amount: req.body.amount,
    payment_date: req.body.payment_date,
  });
  payment = await payment.save();
  if (!payment) {
    return res.status(500).send("The payment cannot be created");
  }
  res.send(payment);
});

module.exports = router;