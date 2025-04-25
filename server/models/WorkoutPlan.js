const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  },
  weight: {
    type: Number
  },
  notes: {
    type: String
  }
});

const WorkoutPlanSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  frequency: {
    type: Number
  },
  exercises: [ExerciseSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);
