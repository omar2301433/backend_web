const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  countInStock: Number,
  rating: Number,
});
exports.Product = mongoose.model("Product", productSchema);