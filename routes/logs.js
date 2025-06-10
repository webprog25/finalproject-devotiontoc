import express from 'express';
import Log from '../models/Log.js';
import { authRequired } from './_auth.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const logs = await Log.find({ user: req.userId }).populate('entries.exercise').sort({ date: -1 });
  res.json(logs);
});

router.post('/', authRequired, async (req, res) => {
  const log = await Log.create({ ...req.body, user: req.userId });
  res.json(log);
});

export default router;
