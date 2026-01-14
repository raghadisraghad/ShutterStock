import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
    title: { type: String, required: true , unique: true },
    description: { type: String, required: true },
    picture: [{ type: String, required: false }],
    collaborators: [{ type: String, required: false }],
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    city: { type: String, required: true },
    archive: { type: Boolean, default: false, required: false },
    dateCreated: { type: Date, default: Date.now },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Work', workSchema);
