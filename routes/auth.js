const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const aleradyCreate = await User.findOne({ email })
  if (aleradyCreate) {
    return res.status(400).json({ message: 'Email already in use' })
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });

  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(201).json({ message: 'User created', body: user, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'email not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'password unvalid' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});
router.post("/", async (req, res)=>{
  await User.collection.dropIndex('username_1');
})
module.exports = router;
