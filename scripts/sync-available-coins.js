require("dotenv").config();
const { Redis } = require("@upstash/redis");
const qs = require("qs");

const rawRedis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

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
  }));

  return redisCoins;
};

async function main() {
  const allCoins = await getAllCoins();
  const mappedCoins = mapCoinGeckoResponseToRedis(allCoins);

  rawRedis.set("available-coins", JSON.stringify(mappedCoins));
}

main();
