const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const clientRoutes = require('./routes/clients');
const checkInRoutes = require("./routes/checkIns");
const goalRoutes = require('./routes/goals');
const dietPlanRoutes = require('./routes/dietPlans');
const workoutPlanRoutes = require('./routes/workoutPlans');
const progressEntryRoutes = require('./routes/progressEntries');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Set up API routes
app.use('/api/clients', clientRoutes);
app.use('/api/check-ins', checkInRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/progress-entries', progressEntryRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
