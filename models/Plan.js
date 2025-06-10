import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: Date, required: true, index: true },
  template:  { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true }
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);
