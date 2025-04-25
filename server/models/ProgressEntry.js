const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressEntrySchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  weight: {
    type: Number
  },
  bodyFat: {
    type: Number
  },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    legs: Number
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgressEntry', ProgressEntrySchema);
