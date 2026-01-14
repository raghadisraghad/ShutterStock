import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    bankDetails: {
        accountHolderName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        branch: { type: String, required: true },
        rib: { type: String, required: true }
    }
});

export default mongoose.model('Payment', paymentSchema);
