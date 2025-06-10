import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  avatar:{ type:String, default:'/placeholder.png' },
  theme: { type:String, default:'auto' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
