require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize express app
const app = express();

// Create local uploads directory for complaint images if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Request logging middleware
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// 2. CORS configuration (allows cross-origin requests from frontend)
app.use(cors());

// 3. JSON body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve complaint uploads directory statically
app.use('/uploads', express.static(uploadsDir));

// Health check root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Public Grievance Management System (SPGMS) Backend API is running.',
    status: 'online'
  });
});

// Configure server port
const PORT = process.env.PORT || 5000;

// Database connection and server bootstrap function
const bootstrap = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Route mountings
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/complaints', require('./routes/complaintRoutes'));
    // app.use('/api/officers', require('./routes/officerRoutes'));

    // 4. Central error and 404 handlers
    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`[Server] Express server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[Server] Bootstrap failure: ${error.message}`);
    process.exit(1);
  }
};

bootstrap();
