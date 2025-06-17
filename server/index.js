const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/recipes', recipeRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Meal Recipe Saver API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
