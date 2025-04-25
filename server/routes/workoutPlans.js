const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

// Get all workout plans
router.get('/', async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find();
    res.json(workoutPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get workout plan by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({ clientId: req.params.clientId });
    if (!workoutPlan) return res.status(404).json({ message: 'Workout plan not found for this client' });
    res.json(workoutPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single workout plan
router.get('/:id', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);
    if (!workoutPlan) return res.status(404).json({ message: 'Workout plan not found' });
    res.json(workoutPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new workout plan
router.post('/', async (req, res) => {

  const workoutPlan = new WorkoutPlan(req.body);

  try {
    const newWorkoutPlan = await workoutPlan.save();
    res.status(201).json(newWorkoutPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update workout plan
router.patch('/:id', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);
    if (!workoutPlan) return res.status(404).json({ message: 'Workout plan not found' });

    Object.keys(req.body).forEach(key => {
      workoutPlan[key] = req.body[key];
    });

    const updatedWorkoutPlan = await workoutPlan.save();
    res.json(updatedWorkoutPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete workout plan
router.delete('/:id', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);
    if (!workoutPlan) return res.status(404).json({ message: 'Workout plan not found' });
    
    await workoutPlan.remove();
    res.json({ message: 'Workout plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
