import express from 'express';
import Template from '../models/Template.js';
import { authRequired } from './_auth.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const templates = await Template.find({ user: req.userId }).populate('items.exercise');
  res.json(templates);
});

router.post('/', authRequired, async (req, res) => {
  const t = await Template.create({ ...req.body, user: req.userId });
  res.json(t);
});

router.delete('/:id', authRequired, async (req, res) => {
  await Template.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ ok: true });
});

export default router;
