const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: String,
  city: String,
  postal_code: String,
  country: String,
  shipping_method: String
});

exports.Shipping = mongoose.model('shipping', shippingSchema);
