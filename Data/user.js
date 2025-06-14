const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  password_hash: {
  type: String,
  required: true,
},
  phone : { type: String, unique: true },
  street : { type: String, default: '' },
  apartment : { type: String, default: '' },
  zip : { type: String, default: '' },
  city : { type: String, default: '' },
  country : { type: String, default: '' },
  is_admin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
userSchema.set('toJSON', {
  virtuals: true,
});


exports.User = mongoose.model('user', userSchema);
exports.userSchema = userSchema;
