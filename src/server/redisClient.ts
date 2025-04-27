// import Redis from 'ioredis';
import { REDIS_URI, REDIS_SECRET } from "$env/static/private";
import { Redis } from "@upstash/redis/cloudflare";

export const redis = new Redis({
  url: REDIS_URI,
  token: REDIS_SECRET
});

// const redisUrl = new URL(REDIS_URI);

// export const redis = new Redis({
//   host: redisUrl.hostname,
//   port: Number(redisUrl.port),
//   username: redisUrl.username,
//   password: redisUrl.password,
//   tls: {}, // Use TLS for rediss
// });

