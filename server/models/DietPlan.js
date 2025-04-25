const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  calories: {
    type: Number
  }
});

const DietPlanSchema = new Schema({
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
  dailyCalories: {
    type: Number
  },
  macros: {
    protein: {
      type: Number
    },
    carbs: {
      type: Number
    },
    fats: {
      type: Number
    }
  },
  meals: [MealSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('DietPlan', DietPlanSchema);
