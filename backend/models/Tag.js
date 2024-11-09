import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: { type: String },
});

export default mongoose.model('Tag', tagSchema);
