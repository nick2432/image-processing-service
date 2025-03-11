const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,  
});

redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', (err) => console.error('Redis Connection Error:', err));

module.exports = redis;
