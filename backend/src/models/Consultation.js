const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatLogs: [{ message: String, sender: String, timestamp: Date }],
  doctorNotes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
