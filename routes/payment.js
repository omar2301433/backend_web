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

router.get(`/:id`, async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(500).json({ message: "The payment with the given ID was not found." });
  }
  res.status(200).send(payment);
});

router.delete(`/:id`, async (req, res) => {
  const payment = await Payment.findByIdAndRemove(req.params.id);
  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment not found" });
  }
  return res.status(200).json({ success: true, message: "The payment is deleted" });
});

router.put(`/:id`, async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      payment_method: req.body.payment_method,
      payment_status: req.body.payment_status,
      amount: req.body.amount,
      payment_date: req.body.payment_date,
    },
    { new: true }
  );

  if (!payment) {
    return res.status(500).send("The payment cannot be updated");
  }
  res.send(payment);
}
);  

module.exports = router;