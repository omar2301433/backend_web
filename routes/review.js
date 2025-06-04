const {Review} = require("../Data/review");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const reviewList = await Review.find();

  if (!reviewList) {
    res.status(500).json({ success: false });
  }
  res.send(reviewList);
});

router.post(`/`, async (req, res) => {
  const review = new Review({
    product_id: req.body.product_id,
    user_id: req.body.user_id,
    rating: req.body.rating,
    comment: req.body.comment,
    created_at: req.body.created_at,
  });
  review = await review.save();
  if (!review) {
    return res.status(500).send("The review cannot be created");
  }
  res.send(review);
});

module.exports = router;