const Product = require("../Data/product");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
  });
  product.save().then((createdProduct) => {
      res.status(201).json(createdProduct);
    }).catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;