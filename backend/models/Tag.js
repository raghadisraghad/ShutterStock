import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

export default mongoose.model('Tag', tagSchema);
