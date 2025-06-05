const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order_date: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      product_name: String,
      quantity: Number,
      price: Number
    }
  ],
  shipping_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
});

exports.Order = mongoose.model('order', orderSchema);
