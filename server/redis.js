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

export const storeFingerprint = (fingerprint) => {
  const redisKey = generateFingerprintString(fingerprint);

  rawRedis.get(redisKey).then((isStored) => {
    if (isStored) {
      rawRedis
        .incr(redisKey)
        .then(() => rawRedis.expire(redisKey, FREE_TIER_REDIS_TTL));
    } else {
      rawRedis.set(redisKey, 1, { ex: FREE_TIER_REDIS_TTL });
    }
  });
};

export const canUserProceed = async (fingerprint, session) => {
  if (session?.user?.hasActivePackage) {
    return { proceed: true, package: session.user.subscription.subId };
  }

  const redisKey = generateFingerprintString(fingerprint);

  const sessionUserCount = (await rawRedis.get(redisKey)) || 0;

  if (sessionUserCount > FREE_TIER_CALCULATION_LIMIT) {
    const ttl = await rawRedis.ttl(redisKey);
    return { proceed: false, ttl, error: "limit reached" };
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

export default rawRedis;
