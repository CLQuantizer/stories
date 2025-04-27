import { REDIS_URI } from '$env/static/private';
import Redis from 'ioredis';

const redisUrl = new URL(REDIS_URI);

export const redis = new Redis({
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  username: redisUrl.username,
  password: redisUrl.password,
  tls: {}, // Use TLS for rediss
});
