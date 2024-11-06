import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true},
    link: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    Image: { type: Buffer, required: true },
    dateCreated: { type: Date, default: Date.now },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

export default mongoose.model('Product', productSchema);
