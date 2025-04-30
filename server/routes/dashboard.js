const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const CheckIn = require('../models/CheckIn');
const ProgressEntry = require('../models/ProgressEntry');

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get total clients count
    const totalClients = await Client.countDocuments();
    
    // Get new clients in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newClients = await Client.countDocuments({ 
      joinDate: { $gte: thirtyDaysAgo } 
    });
    
    // Get upcoming check-ins
    const today = new Date();
    const upcomingCheckIns = await CheckIn.find({
      date: { $gte: today },
      status: 'scheduled'
    }).sort({ date: 1 }).limit(5).populate('clientId', 'firstName lastName');
    
    // Get activity count (check-ins + progress entries in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCheckIns = await CheckIn.countDocuments({
      updatedAt: { $gte: sevenDaysAgo }
    });
    
    const recentProgressEntries = await ProgressEntry.countDocuments({
      date: { $gte: sevenDaysAgo }
    });
    
    const activityCount = recentCheckIns + recentProgressEntries;
    
    res.json({
      totalClients,
      newClients,
      upcomingCheckIns,
      activityCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recent clients
router.get('/recent-clients', async (req, res) => {
  try {
    const recentClients = await Client.find()
      .sort({ joinDate: -1 })
      .limit(4);
      
    res.json(recentClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
