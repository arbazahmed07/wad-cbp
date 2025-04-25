const express = require('express');
const router = express.Router();
const DietPlan = require('../models/DietPlan');

// Get all diet plans
router.get('/', async (req, res) => {
  try {
    const dietPlans = await DietPlan.find();
    res.json(dietPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get diet plan by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({ clientId: req.params.clientId });
    if (!dietPlan) return res.status(404).json({ message: 'Diet plan not found for this client' });
    res.json(dietPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single diet plan
router.get('/:id', async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    if (!dietPlan) return res.status(404).json({ message: 'Diet plan not found' });
    res.json(dietPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new diet plan
router.post('/', async (req, res) => {
  const dietPlan = new DietPlan(req.body);

  try {
    const newDietPlan = await dietPlan.save();
    res.status(201).json(newDietPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update diet plan
router.patch('/:id', async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    if (!dietPlan) return res.status(404).json({ message: 'Diet plan not found' });

    Object.keys(req.body).forEach(key => {
      dietPlan[key] = req.body[key];
    });

    const updatedDietPlan = await dietPlan.save();
    res.json(updatedDietPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete diet plan
router.delete('/:id', async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    if (!dietPlan) return res.status(404).json({ message: 'Diet plan not found' });
    
    await dietPlan.remove();
    res.json({ message: 'Diet plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
