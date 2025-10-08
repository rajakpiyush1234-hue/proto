require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');

const app = express();

// Middleware for parsing JSON and handling CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    time: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vidyavatika';
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('MongoDB Connected Successfully');
    
    // Handle MongoDB connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.error('Please ensure that:');
    console.error('1. MongoDB is installed and running');
    console.error('2. MongoDB is accessible at mongodb://127.0.0.1:27017');
    console.error('3. The database user has proper permissions');
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes with logging
app.use('/api/auth', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}, authRoutes);

// Quiz routes with logging
app.use('/api/quiz', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}, quizRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Improved error handling for server startup
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try these steps:`);
      console.error('1. Check if another instance of the server is running');
      console.error('2. Kill any process using port 5000');
      console.error('3. Or change the PORT in .env file');
    } else {
      console.error('Server error:', err.message);
    }
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});