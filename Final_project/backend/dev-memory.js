const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create({ instance: { port: 27017 } });
  process.env.MONGODB_URI = mongod.getUri();
  console.log('MongoDB (in-memory) URI:', process.env.MONGODB_URI);
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'novacart_dev_secret_change_in_production_2026';
  process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const seed = require('./scripts/seed');
  await seed();
  require('./server.js');
  const shutdown = async () => { await mongod.stop(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
