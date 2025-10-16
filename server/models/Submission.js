const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['tiktok', 'twitter'],
    required: true
  },
  content: {
    url: { type: String, required: true },
    videoUrl: String,
    thumbnailUrl: String,
    title: String,
    description: String
  },
  metrics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'winner'],
    default: 'pending'
  },
  bid: {
    amount: Number, // Для типа "deal"
    currency: { type: String, default: 'BNB' }
  },
  feedback: {
    message: String,
    requestedChanges: [String],
    reviewedAt: Date
  },
  payoutId: {
    type: Number // ID выплаты в смарт-контракте
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы
submissionSchema.index({ campaign: 1 });
submissionSchema.index({ creator: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ 'metrics.views': -1 });

submissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Расчет engagement rate
  if (this.metrics.views > 0) {
    const totalEngagement = this.metrics.likes + this.metrics.comments + this.metrics.shares;
    this.engagementRate = (totalEngagement / this.metrics.views) * 100;
  }
  
  next();
});

module.exports = mongoose.model('Submission', submissionSchema);

