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

router.get(`/:id`, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(500).json({ message: "The review with the given ID was not found." });
  }
  res.status(200).send(review);
}
);

router.delete(`/:id`, async (req, res) => {
  const review = await Review.findByIdAndRemove(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }
  return res.status(200).json({ success: true, message: "The review is deleted" });
} );

router.put(`/:id`, async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      rating: req.body.rating,
      comment: req.body.comment,
      created_at: req.body.created_at,
    },
    { new: true }
  );
  if (!review) {
    return res.status(500).send("The review cannot be updated");
  }
  res.send(review);
}
);

module.exports = router;