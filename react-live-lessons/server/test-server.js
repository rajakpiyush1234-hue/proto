const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/vidyavatika')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});