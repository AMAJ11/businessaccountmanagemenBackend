const express = require('express');
const Merchant = require('../models/Merchant')
const authenticate = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const MerchantRecord = require('../models/MerchantRecord');

const router = express.Router();
router.post('/', authenticate, async (req, res) => {
  const { name, amount, des } = req.body;
  const merchant = new Merchant({
    userId: req.user.id.toString(),
    name,
    amount,
    des

  });
  await merchant.save();
  res.status(201).json(merchant);
});
router.get('/', authenticate, async (req, res) => {
  const merchants = await Merchant.find({ userId: req.user.id });
  res.status(200).json(merchants);
})
router.get('/:id', authenticate, async (req, res) => {
  const merchants = await Merchant.findOne({ _id: req.params.id});
  res.status(200).json(merchants);
})
router.patch('/pay', authenticate, async (req, res) => {
  const { MerchantId, date, value } = req.body;
  const merchantrecord = new MerchantRecord({
    userId: req.user.id.toString(),
    value,
    type: "2",
    MerchantId,
    date: new Date(date),
  });
  await merchantrecord.save();

  try {
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      req.body.MerchantId,
      { $inc: { amount: -Number(value) } },
      { new: true }
    );
    res.status(201).json({ record: merchantrecord, merchant: updatedMerchant });
  }
  catch (err) {
    res.status(403).json({ err })
  }



})


router.patch('/buy', authenticate, async (req, res) => {
  const { MerchantId, date, value } = req.body;
  const merchantrecord = new MerchantRecord({
    userId: req.user.id.toString(),
    value,
    type: "1",
    MerchantId,
    date: new Date(date),
  });
  await merchantrecord.save();

  try {
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      req.body.MerchantId,
      { $inc: { amount: +Number(value) } },
      { new: true }
    );
    res.status(201).json({ record: merchantrecord, merchant: updatedMerchant });
  }
  catch (err) {
    res.status(403).json({ err })
  }



})
module.exports = router;
