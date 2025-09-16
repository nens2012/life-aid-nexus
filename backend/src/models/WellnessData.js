const mongoose = require('mongoose');

const WellnessDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metrics: {
    weight: Number,
    height: Number,
    bloodPressure: String,
    symptoms: [String],
    periodTracking: {
      lastPeriod: Date,
      cycleLength: Number
    },
    wellnessPlans: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WellnessData', WellnessDataSchema);
