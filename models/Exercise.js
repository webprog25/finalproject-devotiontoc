import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscle: String,
  gifUrl: String
}, { timestamps: true });

export default mongoose.model('Exercise', exerciseSchema);
