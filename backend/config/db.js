const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB.
 * Tries MONGODB_URI first, then falls back to MongoMemoryServer if remote database is unreachable.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log('[Database] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[Database] MongoDB Atlas connection failed (${error.message}). Trying in-memory MongoDB fallback...`);
    }
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] Connected to In-Memory MongoDB Server at: ${mongoUri}`);
    return conn;
  } catch (fallbackError) {
    console.error(`[Database] In-memory MongoDB fallback failed: ${fallbackError.message}`);
    throw fallbackError;
  }
};

module.exports = connectDB;
