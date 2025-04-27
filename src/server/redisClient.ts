import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URI!, {
  tls: {} // Important! TLS enabled because of "rediss://"
});