const express = require('express');
const router = express.Router();
const ProgressEntry = require('../models/ProgressEntry');
const Client = require('../models/Client');

// Get all progress entries
router.get('/', async (req, res) => {
  try {
    const entries = await ProgressEntry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get progress entries by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const entries = await ProgressEntry.find({ clientId: req.params.clientId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single progress entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await ProgressEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Progress entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new progress entry
router.post('/', async (req, res) => {
  const entry = new ProgressEntry(req.body);

  try {
    const newEntry = await entry.save();
    
    // Update client's current weight if provided
    if (req.body.weight) {
      await Client.findByIdAndUpdate(
        req.body.clientId, 
        { currentWeight: req.body.weight }
      );
    }
    
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update progress entry
router.patch('/:id', async (req, res) => {
  try {
    const entry = await ProgressEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Progress entry not found' });

    Object.keys(req.body).forEach(key => {
      entry[key] = req.body[key];
    });

    const updatedEntry = await entry.save();
    
    // Update client's current weight if it was updated
    if (req.body.weight) {
      await Client.findByIdAndUpdate(
        entry.clientId, 
        { currentWeight: req.body.weight }
      );
    }
    
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete progress entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await ProgressEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Progress entry not found' });
    
    await entry.remove();
    res.json({ message: 'Progress entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
