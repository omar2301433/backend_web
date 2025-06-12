const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order_date: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' },
  orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required:true,
    }
  ],
  totalPrice: { type: Number},
  shipping_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
});


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('order', orderSchema);
