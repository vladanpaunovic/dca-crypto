const { PrismaClient } = require("@prisma/client");
const qs = require("qs");
const initSentry = require("./initSentry");
initSentry();

/** @type {import('@prisma/client').PrismaClient} */
const prismaClient = global.prisma || new PrismaClient();

const cryptoCompareFetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CRYPTOCOMPARE_API_KEY}`,
  },
};

const getAllAvailableTokens = async () => {
  const getTokensPage = async (page) => {
    const params = qs.stringify({
      page,
      page_size: 100,
      sort_by: "CREATED_ON",
      sort_direction: "DESC",
    });

    const availableCoinsResponse = await fetch(
      `https://data-api.cryptocompare.com/asset/v1/top/list?${params}`,
      cryptoCompareFetchOptions
    );

    const availableCoins = await availableCoinsResponse.json();

    return availableCoins;
  };

  const firstPageTokens = await getTokensPage(1); // first page is 1

  const totalTokens = firstPageTokens.Data.STATS.TOTAL_ASSETS;
  const tokens = [];

  tokens.push(...firstPageTokens.Data.LIST);

  for (let page = 2; page <= totalTokens / 100 + 1; page++) {
    // for (let page = 2; page <= 3; page++) {
    const pageTokens = await getTokensPage(page);
    tokens.push(...pageTokens.Data.LIST);
  }

  console.log(`availableTokens: ${tokens.length}, totalTokens: ${totalTokens}`);
  return tokens;
};

async function main() {
  const availableCoins = await getAllAvailableTokens();

  const symbols = availableCoins.map((coin) => coin.SYMBOL);
  const coinsFromDb = await prismaClient.cryptocurrency.findMany({
    where: {
      symbol: {
        in: symbols,
      },
    },
  });

  const coinsToUpdate = availableCoins.filter((apiCoin) => {
    const dbCoin = coinsFromDb.find((coin) => coin.symbol === apiCoin.SYMBOL);
    return (
      dbCoin &&
      (dbCoin.description !== apiCoin.ASSET_DESCRIPTION ||
        dbCoin.descriptionSummary !== apiCoin.ASSET_DESCRIPTION_SUMMARY)
    );
  });

  console.log(`Updating: ${coinsToUpdate.length} coins`);
  let discovered = 0;
  for (let index = 0; index < coinsToUpdate.length; index++) {
    const coin = coinsToUpdate[index];
    const {
      ASSET_DESCRIPTION,
      ASSET_DESCRIPTION_SUMMARY,
      WEBSITE_URL,
      NAME,
      SYMBOL,
    } = coin;

    console.log(
      `#${index + 1}/${
        coinsToUpdate.length
      } - Updating coin ${NAME} (${SYMBOL})`
    );

    await prismaClient.cryptocurrency.update({
      where: { symbol: SYMBOL },
      data: {
        description: ASSET_DESCRIPTION,
        descriptionSummary: ASSET_DESCRIPTION_SUMMARY,
        websiteUrl: WEBSITE_URL,
      },
    });

    discovered += 1;
  }

  // calculate the percentage of updated tokens
  const percentage = (discovered / availableCoins.length) * 100;
  console.log(
    `Updated ${discovered}/${
      availableCoins.length
    } tokens (${percentage.toFixed(2)}%)`
  );
}

main();
