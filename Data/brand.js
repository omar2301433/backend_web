const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

exports.Brand = mongoose.model('brand', brandSchema);
