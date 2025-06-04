const {Product} = require("../Data/product");
const {Category} = require("../Data/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});



router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");
  
  let product = new Product({
    name: req.body.name,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    description: req.body.description,
    image_url: req.body.image_url,
    specs: req.body.specs,
    isFeatured: req.body.isFeatured,
    quantity: req.body.quantity,
  });
 product = await product.save();
  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);
});


router.put("/:id", async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
  return res.status(400).send("Invalid product id")
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const product = await Product.findByIdAndUpdate(
   req.params.id,
    {
    name: req.body.name,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    description: req.body.description,
    image_url: req.body.image_url,
    specs: req.body.specs,
    isFeatured: req.body.isFeatured,
    quantity: req.body.quantity,
    },
    {new: true}
  );
  if (!product) 
    return res.status(400).send("the product cannot be update ");
  
  res.send(product);
});



router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(500).send("The product cannot be delted");
  }
  res.status(200).json({ success: true, message: "The product is deleted" });
});


router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount : productCount
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;