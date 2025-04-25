const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');
const Client = require('../models/Client');

// Get all check-ins
router.get('/', async (req, res) => {
  try {
    const checkIns = await CheckIn.find();
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get check-ins by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ clientId: req.params.clientId });
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single check-in
router.get('/:id', async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);
    if (!checkIn) return res.status(404).json({ message: 'Check-in not found' });
    res.json(checkIn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new check-in
router.post('/', async (req, res) => {
  try {
    // Ensure date is a proper Date object
    const checkInData = {
      ...req.body,
      date: new Date(req.body.date)
    };
    
    const checkIn = new CheckIn(checkInData);
    const newCheckIn = await checkIn.save();
    
    // Update client's next check-in date
    await Client.findByIdAndUpdate(
      req.body.clientId, 
      { nextCheckIn: new Date(req.body.date) }
    );
    
    res.status(201).json(newCheckIn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update check-in
router.patch('/:id', async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);
    if (!checkIn) return res.status(404).json({ message: 'Check-in not found' });

    // Process each field, ensuring dates are proper Date objects
    Object.keys(req.body).forEach(key => {
      if (key === 'date') {
        checkIn[key] = new Date(req.body[key]);
      } else {
        checkIn[key] = req.body[key];
      }
    });

    const updatedCheckIn = await checkIn.save();

    // If date was updated, also update client's next check-in
    if (req.body.date) {
      await Client.findByIdAndUpdate(
        checkIn.clientId, 
        { nextCheckIn: new Date(req.body.date) }
      );
    }
    
    res.json(updatedCheckIn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete check-in
router.delete('/:id', async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);
    if (!checkIn) return res.status(404).json({ message: 'Check-in not found' });
  
    await CheckIn.deleteOne({ _id: req.params.id });
    res.json({ message: 'Check-in deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
