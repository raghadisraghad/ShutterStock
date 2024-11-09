import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    role: { type: String, default: '1' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String, default: null, required: true },
    dateCreated: { type: Date, default: Date.now },
    birthDate: { type: Date, required: true },
    avatar: { type: String, default: null },
    description: { type: String, default: null },
    materials: { type: [String], default: [] },
    instagram: { type: String, default: null },
    linkedin: { type: String, default: null },
    facebook: { type: String, default: null },
    x: { type: String, default: null },
    youtube: { type: String, default: null },
    website: { type: String, default: null },
    status: { type: Boolean, default: false, required: true }
});

export default mongoose.model('User', userSchema);
