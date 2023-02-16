require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

const mapCoinGeckoResponseToRedis = (coins) => {
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
  const allCoins = await prismaClient.cryptocurrency.findMany();

  console.log("Mapping coins to redis format...");
  const mappedCoins = mapCoinGeckoResponseToRedis(allCoins);

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
