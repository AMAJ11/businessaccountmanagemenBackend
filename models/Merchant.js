const mongoose = require('mongoose');
const Record = require('./Record');

const MerchantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String },
    amount: { type: Number, required: true },
    des:{type: String}
}, { timestamps: true });

module.exports = mongoose.model('Merchant', MerchantSchema);
