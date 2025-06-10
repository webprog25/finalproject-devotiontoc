import express from 'express';
import Exercise from '../models/Exercise.js';
import { authRequired } from './_auth.js';

const router = express.Router();

router.get('/', authRequired, async (_req, res) => {
  const list = await Exercise.find().sort({ name: 1 });
  res.json(list);
});

router.post('/', authRequired, async (req, res) => {
  const ex = await Exercise.create(req.body);
  res.json(ex);
});

export default router;
