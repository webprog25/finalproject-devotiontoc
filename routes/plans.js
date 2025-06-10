import express from 'express';
import Plan from '../models/Plan.js';
import { authRequired } from './_auth.js';

const router = express.Router();

// GET /api/plans?month=2025-06 
router.get('/', authRequired, async (req, res) => {
  const [y, m] = (req.query.month ?? '').split('-');
  if (!y) return res.json([]);
  const from = new Date(+y, +m - 1, 1);
  const to   = new Date(+y, +m,     1);
  const plans = await Plan.find({
    user: req.userId,
    date: { $gte: from, $lt: to }
  }).populate('template');
  res.json(plans);
});

// PUT /api/plans
router.put('/', authRequired, async (req, res) => {
  const { date, template } = req.body;
  const plan = await Plan.findOneAndUpdate(
    { user: req.userId, date },
    { template },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(plan);
});

export default router;
