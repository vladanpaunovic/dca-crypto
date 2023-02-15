const { PrismaClient } = require("@prisma/client");
const qs = require("qs");

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    console.log(
      `CoinGecko API Rate limit exceeded, sleeping for ${
        SLEEP_TIMEOUT_70_SEC / 1000
      }s and retrying`
    );
    await sleep(SLEEP_TIMEOUT_70_SEC);
    return getCoinPrice(coinSymbol);
  }

  const mapDataToPrices = (prices) =>
    prices.map((price) => [price.time, parseFloat(price.close)]);

  if (!coinData.Data?.Data || !coinData.Data?.Data?.length) {
    return [];
  }

  return mapDataToPrices(coinData.Data.Data);
};

async function main() {
  const availableCoins = await getAllAvailableTokens();

  // delete all coins from the database that are not in the availableCoins list
  await prismaClient.cryptocurrency.deleteMany({
    where: {
      coinId: {
        notIn: availableCoins.map((coin) => coin.id),
      },
    },
  });

  // for each coin in availableCoins fetch the coin data from the external APIs
  // and store it in the database
  for (let index = 0; index < availableCoins.length; index++) {
    // sleep every 10 requests to avoid rate limits
    if (index % 100 === 0) {
      const SLEEP_TIMEOUT_10_SEC = 10000;
      console.log(
        `Sleeping for ${SLEEP_TIMEOUT_10_SEC / 1000}s to avoid rate limits`
      );
      await sleep(SLEEP_TIMEOUT_10_SEC);
    }

    const coin = availableCoins[index];

    const coinPrices = await getCoinPrice(coin.symbol);

    // if fields in coinData are missing, skip it
    if (!coin.name || !coin.symbol || !coin.id) {
      console.log(
        `Skipping #${index + 1}/${availableCoins.length} ${
          coin.id
        } due to missing fields`
      );
      continue;
    }

    const payload = {
      name: coin.name,
      symbol: coin.symbol,
      coinId: coin.id,
      currentPrice: parseFloat(coin.priceUsd || 0),
      marketCapRank: parseInt(coin.rank),
    };

    payload.prices = coinPrices || [];

    // store cryptocurrencies in the database
    console.log(`Storing #${index + 1}/${availableCoins.length} ${coin.id}`);

    await prismaClient.cryptocurrency.upsert({
      where: {
        coinId: coin.id,
      },
      update: payload,
      create: payload,
    });
  }
}

main();
