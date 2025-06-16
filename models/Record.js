const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['1', '2'], required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);
