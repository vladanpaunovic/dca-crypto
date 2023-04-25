require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const initSentry = require("./initSentry");
initSentry();

/**
 * This script is used to sync the available coins from CoinGecko to Redis.
 * This is used to populate the available coins in the frontend.
 * This script is run on a cron job.
 */

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

const mapCoinGeckoResponseToKeyValue = (coins) => {
  const redisCoins = coins.map((coin) => ({
    id: coin.coinId,
    coinId: coin.coinId,
    symbol: coin.symbol,
    name: coin.name,
    marketCapRank: coin.marketCapRank,
  }));

  return redisCoins;
};

async function main() {
  console.log("Fetching all available coins...");
  const allCoins = await prismaClient.cryptocurrency.findMany({
    select: {
      coinId: true,
      symbol: true,
      name: true,
      marketCapRank: true,
    },
  });

  console.log("Mapping coins to redis format...");
  const mappedCoins = mapCoinGeckoResponseToKeyValue(allCoins);

  console.log("Upserting coins to Prisma...");
  const key = "availableTokens";
  const value = mappedCoins;
  await prismaClient.bigKeyValueStore.upsert({
    where: { key },
    update: { value, key },
    create: { value, key },
  });
}

main();
