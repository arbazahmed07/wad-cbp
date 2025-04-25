const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number
  },
  currentWeight: {
    type: Number
  },
  initialWeight: {
    type: Number
  },
  notes: {
    type: String
  },
  nextCheckIn: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', ClientSchema);
