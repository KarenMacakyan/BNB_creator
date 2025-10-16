const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['brand', 'creator'],
    required: true
  },
  profile: {
    displayName: String,
    bio: String,
    avatar: String,
    coverImage: String,
    website: String,
    email: String
  },
  social: {
    tiktok: String,
    twitter: String, // X
    instagram: String,
    youtube: String
  },
  stats: {
    tiktokFollowers: { type: Number, default: 0 },
    twitterFollowers: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Индексы для быстрого поиска
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'stats.tiktokFollowers': -1 });

module.exports = mongoose.model('User', userSchema);

