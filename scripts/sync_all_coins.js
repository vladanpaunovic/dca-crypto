const { PrismaClient } = require("@prisma/client");
const qs = require("qs");
const initSentry = require("./initSentry");
initSentry();

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

const sleep = (ms) =>
  new Promise((resolve) => {
    console.log(`Sleeping for ${ms / 1000}s...`);
    setTimeout(resolve, ms);
  });

const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
const COINCAP_API_KEY = process.env.COINCAP_API_KEY;

const cryptoCompareFetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CRYPTOCOMPARE_API_KEY}`,
  },
};

const getAllAvailableTokens = async () => {
  const coinCapFetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${COINCAP_API_KEY}`,
    },
  };

  const availableCoinsResponse = await fetch(
    `https://api.coincap.io/v2/assets?limit=1000`,
    coinCapFetchOptions
  );
  const availableCoins = await availableCoinsResponse.json();

  console.log(`availableCoins: ${availableCoins.data.length}`);

  return availableCoins.data;
};

const getCoinPrice = async (coinSymbol) => {
  const params = qs.stringify({
    fsym: coinSymbol,
    tsym: "USD",
    allData: true,
  });

  const coinDataResponse = await fetch(
    `https://min-api.cryptocompare.com/data/v2/histoday?${params}`,
    cryptoCompareFetchOptions
  );

  const coinData = await coinDataResponse.json();

  if (coinDataResponse.status === 429) {
    const SLEEP_TIMEOUT_70_SEC = 79000;
    await sleep(SLEEP_TIMEOUT_70_SEC);
    return getCoinPrice(coinSymbol);
  }

  const mapDataToPrices = (prices) =>
    prices.map((price) => [price.time * 1000, parseFloat(price.close)]);

  if (!coinData.Data?.Data || !coinData.Data?.Data?.length) {
    return [];
  }

  return mapDataToPrices(coinData.Data.Data);
};

async function main() {
  const availableCoins = await getAllAvailableTokens();
  const existingCoins = await prismaClient.cryptocurrency.findMany({
    select: { coinId: true },
  });
  const existingCoinIds = existingCoins.map((coin) => coin.coinId);

  const coinsToDelete = existingCoinIds.filter(
    (coinId) => !availableCoins.some((coin) => coin.id === coinId)
  );

  // Delete coins not in availableCoins list
  if (coinsToDelete.length > 0) {
    console.log(`Deleting ${coinsToDelete.length} coins...`);
    await prismaClient.cryptocurrency.deleteMany({
      where: {
        coinId: {
          in: coinsToDelete,
        },
      },
    });
  }

  const coinsToCreate = [];
  const coinsToUpdate = [];

  // Check if a coin is new or already exists in the database
  for (const coin of availableCoins) {
    // sleep every 10 requests to avoid rate limits
    const coinIndex = availableCoins.indexOf(coin);
    const coinPrices = await getCoinPrice(coin.symbol);

    if (coinIndex % 200 === 0 && coinIndex !== 0) {
      await sleep(10000); // sleep for 10 seconds
    }

    console.log(
      `Processing #${coinIndex + 1}/${availableCoins.length} ${coin.id}...`
    );

    // if fields in coinData are missing, skip it
    if (!coin.name || !coin.symbol || !coin.id) {
      console.log(`Skipping ${coin.id} due to missing fields`);
      continue;
    }

    const payload = {
      name: coin.name,
      symbol: coin.symbol,
      coinId: coin.id,
      currentPrice: parseFloat(coin.priceUsd || 0),
      marketCapRank: parseInt(coin.rank),
      image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
      prices: coinPrices || [],
    };

    if (existingCoinIds.includes(coin.id)) {
      coinsToUpdate.push(payload);
    } else {
      coinsToCreate.push(payload);
    }
  }

  // Create new coins
  if (coinsToCreate.length > 0) {
    console.log(`Creating ${coinsToCreate.length} coins...`);
    await prismaClient.cryptocurrency.createMany({
      data: coinsToCreate,
    });
  }

  // Update existing coins
  const updatePromises = coinsToUpdate.map((coin) => {
    return prismaClient.cryptocurrency.update({
      where: {
        coinId: coin.coinId,
      },
      data: {
        currentPrice: parseFloat(coin.priceUsd || 0),
        prices: coin.prices,
      },
    });
  });

  if (updatePromises.length > 0) {
    console.log(`Updating ${coinsToUpdate.length} coins...`);
    // show progress on update
    for (const promise of updatePromises) {
      const promiseIndex = updatePromises.indexOf(promise);
      // sleep every 10 requests to avoid database failures
      if (promiseIndex % 200 === 0 && promiseIndex !== 0) {
        await sleep(10000); // sleep for 10 seconds
      }

      console.log(`Updating coin ${promiseIndex + 1}/${updatePromises.length}`);
      await promise;
    }
  }

  console.log("Done!");
}

main();
