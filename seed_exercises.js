import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from './models/Exercise.js';
dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/ironlog';
await mongoose.connect(MONGO);

const data = [
  { name: 'Bench Press', muscle: 'Chest',  gifUrl: '' },
  { name: 'Squat',       muscle: 'Legs',   gifUrl: '' },
  { name: 'Deadlift',    muscle: 'Back',   gifUrl: '' },
  { name: 'Overhead Press', muscle: 'Shoulders', gifUrl: '' },
  { name: 'Barbell Row', muscle: 'Back',   gifUrl: '' }
];

await Exercise.deleteMany({});
await Exercise.insertMany(data);
console.log('Seeded exercises');
process.exit();
