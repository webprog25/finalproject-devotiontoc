import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  weight: Number,
  reps: Number
}, { _id: false });

const entrySchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  sets: [setSchema]        
});

const logSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:  { type: Date, default: Date.now },
  entries: [entrySchema]
}, { timestamps: true });

export default mongoose.model('Log', logSchema);
