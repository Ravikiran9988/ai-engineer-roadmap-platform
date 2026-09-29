const app = require('./app');
const env = require('./config/env');
const { connectRedis } = require('./config/redis');
const db = require('./config/database');

async function startServer() {
  try {
    // Test Database connection
    await db.query('SELECT 1');
    console.log('Connected to PostgreSQL');

    // Connect to Redis
    await connectRedis();

    app.listen(env.port, () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
