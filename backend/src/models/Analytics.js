const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dashboardData: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
