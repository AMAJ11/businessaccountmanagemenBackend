const express = require('express');
const Record = require('../models/Record');
const authenticate = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const MerchantRecord = require('../models/MerchantRecord');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { amount, type, description, date, time } = req.body;
  const record = new Record({
    userId: req.user.id.toString(),
    amount,
    type,
    description,
    date: new Date(date),
    time,
  });
  await record.save();
  res.status(201).json(record);
});

router.get('/', authenticate, async (req, res) => {
  const { from, to, search } = req.query;

  const startDate = new Date(from);
  const endDate = new Date(to);
  endDate.setHours(23, 59, 59, 999);

  const query = {
    userId: req.user.id,
    date: { $gte: startDate, $lte: endDate }
  };

  if (search) {
    query.description = { $regex: search, $options: 'i' };
  }

  try {
    const records = await Record.find(query).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/all', authenticate, async (req, res) => {
  const records = await Record.find();
  res.status(200).json(records);
});

router.get('/merchant', authenticate, async (req, res) => {
  const { from, to , MerchantId} = req.query;

  const startDate = new Date(from);
  const endDate = new Date(to);
  endDate.setHours(23, 59, 59, 999);

  const query = {
    MerchantId,
    // date: { $gte: startDate, $lte: endDate }
  };
  try {
    const merchantRecord = await MerchantRecord.find(query).sort({ date: -1 }).populate("MerchantId");
    res.json(merchantRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})


module.exports = router;
