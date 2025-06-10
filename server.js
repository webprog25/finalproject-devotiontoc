import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import exerciseRoutes from './routes/exercises.js';
import templateRoutes from './routes/templates.js';
import logRoutes from './routes/logs.js';
import planRoutes from './routes/plans.js';
import userRoutes from './routes/user.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/ironlog';
mongoose.connect(mongo)
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.error(err));


app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/user', userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = 'public';
app.use(express.static(path.join(__dirname, root)));

app.get('/api/config', (_req, res) => {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID || '' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, root, 'index.html'));
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on ' + port));
