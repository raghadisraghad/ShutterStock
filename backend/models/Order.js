import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    dateCreated: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    archive: { type: Boolean, default: false, required: false },
});

export default mongoose.model('Order', ordersSchema);
