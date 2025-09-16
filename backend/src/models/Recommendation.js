const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendations: [String],
  safetyGuidelines: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
