import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/google', async (req, res) => {
  const { googleId, name, email, avatar } = req.body;
  if (!googleId) 
    return res.status(400).json({ error: 'googleId required' });

  let user = await User.findOne({ googleId });

  if (!user) 
    user = await User.create({ googleId, name, email, avatar });

  const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

export default router;
