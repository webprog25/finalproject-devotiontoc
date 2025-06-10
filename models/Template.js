import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  color: { type: String, default: '#4f46e5' },
  items: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: Number,
    reps: Number
  }]
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);
