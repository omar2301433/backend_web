const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String , required: true },
  images: [{ type: String }],
  specs: String,
  isFeatured: { type: Boolean, default: false },
  quantity: { type: Number, required: true , min: 0 , max: 1000},
  created_at: { type: Date, default: Date.now }
});

ProductSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
ProductSchema.set('toJSON', {
  virtuals: true,
}); 

exports.Product = mongoose.model('Product', ProductSchema);
