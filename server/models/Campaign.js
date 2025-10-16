const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  contractId: {
    type: Number,
    required: true,
    unique: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brandWallet: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['contest', 'deal'],
    required: true
  },
  category: {
    type: String,
    enum: ['fashion', 'beauty', 'tech', 'food', 'fitness', 'gaming', 'lifestyle', 'other'],
    required: true
  },
  budget: {
    total: { type: Number, required: true },
    remaining: { type: Number, required: true },
    currency: { type: String, default: 'BNB' }
  },
  prizes: [{
    place: Number,
    amount: Number,
    description: String
  }],
  requirements: {
    platforms: [{ type: String, enum: ['tiktok', 'twitter'] }],
    minFollowers: Number,
    contentType: String,
    guidelines: String,
    hashtags: [String],
    mentions: [String]
  },
  targetRegions: [String],
  duration: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  media: {
    images: [String],
    videos: [String],
    inspirationLinks: [String]
  },
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 }
  },
  winners: [{
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
    place: Number,
    amount: Number,
    paidAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы
campaignSchema.index({ contractId: 1 });
campaignSchema.index({ brand: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ type: 1 });
campaignSchema.index({ 'duration.endDate': 1 });

campaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);

