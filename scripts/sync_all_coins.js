const { PrismaClient } = require("@prisma/client");
const qs = require("qs");

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

const CG_API_URL = "https://api.coingecko.com/api/v3";

const SLEEP_TIMEOUT = 3000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // delete all coins from the database
  //   await prismaClient.cryptocurrency.deleteMany();

  //   return;
  // 1. fetch all availableCoins from the coingecko API
  const availableCoins = await (await fetch(`${CG_API_URL}/coins/list`)).json();

  console.log(`availableCoins: ${availableCoins.length}`);

  // delete all coins from the database that are not in the availableCoins list
  await prismaClient.cryptocurrency.deleteMany({
    where: {
      coinId: {
        notIn: availableCoins.map((coin) => coin.id),
      },
    },
  });

  // for each coin in availableCoins fetch the coin data from the coingecko API
  // and store it in the database
  for (let index = 0; index < availableCoins.length; index++) {
    const coin = availableCoins[index];

    const coinData = await (
      await fetch(`${CG_API_URL}/coins/${coin.id}`)
    ).json();

    const payload = {
      name: coinData.name,
      symbol: coinData.symbol,
      coinId: coinData.id,
      currentPrice: coinData.market_data?.current_price?.usd || null,
      marketCapRank: coinData.market_cap_rank || null,
      image: coinData.image.small,
      description: coinData.description.en,
    };

    // get coin prices
    const priceParams = qs.stringify({
      vs_currency: "usd",
      from: convertDateStringToUnix(new Date("01-01-2010")),
      to: convertDateStringToUnix(new Date()),
    });

    const coinPrices = await (
      await fetch(
        `${CG_API_URL}/coins/${coin.id}/market_chart/range?${priceParams}`
      )
    ).json();

    payload.prices = coinPrices.prices || [];

    console.log(
      `Storing #${index + 1}/${availableCoins.length} ${coinData.name}`
    );

    // store cryptocurrencies in the database
    await prismaClient.cryptocurrency.upsert({
      where: {
        coinId: coinData.id,
      },
      update: payload,
      create: payload,
    });

    await sleep(SLEEP_TIMEOUT);
  }
}

main();
