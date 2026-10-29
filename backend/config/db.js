const mongoose = require('mongoose');

/**
 * MongoDB Database Connection for The Lunchroom
 * Connects to process.env.MONGO_URI (or MONGODB_URI) and defaults to localhost.
 * If no local daemon is running, automatically starts an embedded MongoMemoryServer.
 */
const connectDB = async () => {
  // Checks for both standard environment variables, defaults to local
  const targetUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/TheLunchroom';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2500, // Short timeout so it falls back quickly if unreachable
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Ensure default demo accounts and menu items exist
    const { ensureDemoSeed } = require('../utils/seed');
    if (ensureDemoSeed) {
      await ensureDemoSeed();
    }
    return conn;
  } catch (error) {
    console.log(`ℹ️ Notice: External/Local MongoDB not reachable (${error.message}).`);
    console.log(`🚀 Starting local embedded MongoDB instance for The Lunchroom...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'TheLunchroom' },
      });
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✓ Embedded MongoDB Server running at: ${memoryUri}`);

      // Auto-seed initial starting dishes and test accounts into the memory database
      const { autoSeed } = require('../utils/seed');
      if (autoSeed) {
        await autoSeed();
      }
      
      return conn;
    } catch (memError) {
      console.error(`✗ Failed to initialize MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;