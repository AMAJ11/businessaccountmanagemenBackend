const mongoose = require('mongoose');

const MerchantRecordSchema = new mongoose.Schema({
    MerchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    date: { type: Date, required: true },
    value: { type: Number, required: true },
    type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MerchantRecord', MerchantRecordSchema);