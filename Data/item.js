const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})



exports.Item = mongoose.model('item', ItemSchema);
