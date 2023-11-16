require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/financeTracker');


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard')); 

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
