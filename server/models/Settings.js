import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  openaiApiKey: { type: String, required: true },
  facebookAccessToken: { type: String },
  instagramUsername: { type: String },
  instagramPassword: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Settings', settingsSchema);