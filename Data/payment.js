const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payment_method: String,
  payment_status: String,
  amount: Number,
  payment_date: { type: Date, default: Date.now }
});

exports.Payment = mongoose.model('payment', paymentSchema);
