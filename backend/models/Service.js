import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true , unique: true },
    description: { type: String, required: true },
    local: { type: String, required: true },
    background: { type: String, required: false },
    city: { type: String, required: true },
    works: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Work' }],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Service', serviceSchema);
