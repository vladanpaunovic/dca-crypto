require("dotenv").config();
const qs = require("qs");
const updateVercelEdgeConfig = require("./vercelEdgeConfig");

const getAllCoins = async () => {
  const params = qs.stringify({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 20,
    page: 1,
    sparkline: false,
  });

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?${params}`
  );

  return response.json();
};

const mapCoinGeckoResponseToRedis = (coins) => {
  const redisCoins = coins.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price,
    market_cap_rank: coin.market_cap_rank,
  }));

  return redisCoins;
};

async function main() {
  const allCoins = await getAllCoins();
  const mappedCoins = mapCoinGeckoResponseToRedis(allCoins);

  updateVercelEdgeConfig("available-coins", mappedCoins);
}

main();
