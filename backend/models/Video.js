import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    picture: { type: String, required: false },
    video: { type: String, required: false },
    city: { type: String, required: true },
    archive: { type: Boolean, default: false, required: false },
    dateCreated: { type: Date, default: Date.now },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

export default mongoose.model('Video', videoSchema);
