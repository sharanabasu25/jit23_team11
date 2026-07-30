const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB Atlas.
 * Uses the MONGODB_URI environment variable.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is missing.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
