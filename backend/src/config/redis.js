const { createClient } = require('redis');
const env = require('./env');

const redisClient = createClient({
  url: env.redis.url
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Connected to Redis');
  }
}

module.exports = {
  redisClient,
  connectRedis
};
