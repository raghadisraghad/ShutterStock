const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    dateCreated: { type: Date, default: Date.now },
    total: { type: Number, required: true},
    status: { type: String, required: true}
});

module.exports = mongoose.model('Tag', ordersSchema);
