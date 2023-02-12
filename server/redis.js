// src/lib/redis.ts

import { Redis } from "@upstash/redis";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { FREE_TIER_CALCULATION_LIMIT, FREE_TIER_REDIS_TTL } from "../config";

const rawRedis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export const upstashAdopter = UpstashRedisAdapter(rawRedis);

const generateFingerprintString = (fingerprint) => `fingerprint:${fingerprint}`;

export const storeFingerprint = async (fingerprint) => {
  const redisKey = generateFingerprintString(fingerprint);

  const currentRedisKey = await rawRedis.get(redisKey);

  if (currentRedisKey) {
    await rawRedis.set(redisKey, currentRedisKey + 1, {
      ex: FREE_TIER_REDIS_TTL,
    });
  } else {
    await rawRedis.set(redisKey, 1, { ex: FREE_TIER_REDIS_TTL });
  }
};

export const canUserProceed = async (fingerprint, session) => {
  if (session?.user?.hasActivePackage) {
    return { proceed: true, package: session.user.subscription.subId };
  }

  const redisKey = generateFingerprintString(fingerprint);

  const redisResponse = await rawRedis.get(redisKey);
  const sessionUserCount = redisResponse || 1;

  if (sessionUserCount > FREE_TIER_CALCULATION_LIMIT) {
    const ttl = await rawRedis.ttl(redisKey);
    return { proceed: false, ttl, error: "limit reached" };
  }

  if (!redisResponse) {
    rawRedis.set(redisKey, 1, { ex: FREE_TIER_REDIS_TTL });
  }

  return {
    proceed: true,
    sessionUserCount,
    available: FREE_TIER_CALCULATION_LIMIT,
  };
};

export const getAllAvailableCoins = async () => {
  const availableCoins = await rawRedis.get("available-coins");

  if (availableCoins) {
    return availableCoins;
  }

  return [];
};

export const getSitemaps = async () => {
  const sitemaps = await rawRedis.get("sitemaps");

  if (sitemaps) {
    return sitemaps;
  }

  return [];
};

export default rawRedis;
