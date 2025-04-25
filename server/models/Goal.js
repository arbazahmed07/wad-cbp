const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS']
  },
  description: {
    type: String,
    required: true
  },
  targetDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'NOT_STARTED'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startValue: {
    type: Number
  },
  currentValue: {
    type: Number
  },
  targetValue: {
    type: Number
  },
  unit: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);
