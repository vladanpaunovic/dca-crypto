// src/lib/redis.ts

import "dotenv/config";
import { Redis } from "@upstash/redis";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";

const rawRedis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export const upstashAdopter = UpstashRedisAdapter(rawRedis);

export default rawRedis;
