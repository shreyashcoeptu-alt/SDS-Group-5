const mongoose = require('mongoose');

/**
 * MongoDB Database Connection for The Lunchroom
 * Connects to process.env.MONGO_URI (e.g. mongodb://localhost:27017/TheLunchroom).
 * If no local daemon is running, automatically starts an embedded MongoMemoryServer
 * so that evaluation and development work out-of-the-box with zero setup!
 */
const connectDB = async () => {
  const targetUri = process.env.MONGO_URI || 'mongodb://localhost:27017/TheLunchroom';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.log(`ℹ️ Notice: External MongoDB not reachable (${error.message}).`);
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
    } catch (memError) {
      console.error(`✗ Failed to initialize MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
