const express = require('express');
const Record = require('../models/Record');
const authenticate = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
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

  console.log("UserId:", req.user.id);
  console.log("From:", from, "To:", to);
  console.log("Parsed Dates:", startDate, endDate);

  const query = {
    userId: req.user.id,
    date: { $gte: startDate, $lte: endDate }
  };
  console.log(query);

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

module.exports = router;
