// src/lib/redis.ts

import { Redis } from "@upstash/redis";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { FREE_TIER_CALCULATION_LIMIT, FREE_TIER_REDIS_TTL } from "../config";

const rawRedis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export const upstashAdopter = UpstashRedisAdapter(rawRedis);

const generateFingerprintKey = (fingerprint) => `fingerprint:${fingerprint}`;

const updateRedisKey = async (key, value, ttl) => {
  await rawRedis.set(key, value, { ex: ttl });
};

const getOrInitializeRedisKey = async (key, defaultValue, ttl) => {
  const redisValue = await rawRedis.get(key);
  if (redisValue) return redisValue;

  await updateRedisKey(key, defaultValue, ttl);
  return defaultValue;
};

export const storeFingerprint = async (fingerprint) => {
  const redisKey = generateFingerprintKey(fingerprint);
  const currentCount = await getOrInitializeRedisKey(
    redisKey,
    1,
    FREE_TIER_REDIS_TTL
  );

  // Only update the count if it's below the limit
  if (parseInt(currentCount) <= FREE_TIER_CALCULATION_LIMIT) {
    await updateRedisKey(
      redisKey,
      parseInt(currentCount) + 1,
      FREE_TIER_REDIS_TTL
    );
  }
};

export const canUserProceed = async (fingerprint, session) => {
  if (session?.user?.hasActivePackage) {
    return { proceed: true, package: session.user.subscription.subId };
  }

  const redisKey = generateFingerprintKey(fingerprint);
  const sessionUserCount = await getOrInitializeRedisKey(
    redisKey,
    1,
    FREE_TIER_REDIS_TTL
  );

  if (parseInt(sessionUserCount) > FREE_TIER_CALCULATION_LIMIT) {
    const ttl = await rawRedis.ttl(redisKey);
    return { proceed: false, ttl, error: "limit reached" };
  }

  return {
    proceed: true,
    sessionUserCount: parseInt(sessionUserCount),
    available: FREE_TIER_CALCULATION_LIMIT,
  };
};

export const getSitemaps = async () => {
  const sitemaps = await rawRedis.get("sitemaps");

  if (sitemaps) {
    return sitemaps;
  }

  return [];
};

export default rawRedis;
