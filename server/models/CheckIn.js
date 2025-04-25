const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckInSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'missed'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  duration: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
