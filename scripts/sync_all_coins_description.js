const { PrismaClient } = require("@prisma/client");
const qs = require("qs");

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

  let discovered = 0;
  for (let index = 0; index < availableCoins.length; index++) {
    const coin = availableCoins[index];

    const {
      ASSET_DESCRIPTION,
      ASSET_DESCRIPTION_SUMMARY,
      WEBSITE_URL,
      LOGO_URL,
      NAME,
      URI,
      SYMBOL,
    } = coin;

    const findCoin = await prismaClient.cryptocurrency.findFirst({
      where: {
        symbol: SYMBOL,
      },
    });

    if (!findCoin) {
      console.log(
        `#${index + 1}/${
          availableCoins.length
        } - Not found in the database, skipping...`
      );
      continue;
    }

    console.log(
      `#${index + 1}/${
        availableCoins.length
      } - Updating coin ${NAME} (${SYMBOL})`
    );

    await prismaClient.cryptocurrency.update({
      where: { symbol: SYMBOL },
      data: {
        description: ASSET_DESCRIPTION,
        descriptionSummary: ASSET_DESCRIPTION_SUMMARY,
        websiteUrl: WEBSITE_URL,
        image: LOGO_URL,
      },
    });

    discovered += 1;
  }

  // calculate the percentage of found tokens
  const percentage = (discovered / availableCoins.length) * 100;
  console.log(
    `Discovered ${discovered}/${
      availableCoins.length
    } tokens (${percentage.toFixed(2)}%)`
  );
}

main();
