import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3/";

const coinGeckoClient = axios.create({ baseURL: API_URL });

export const fetchCoinGeckoMarkets = async (currency) => {
  const response = await coinGeckoClient.get("coins/markets", {
    params: {
      vs_currency: currency || "usd",
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      sparkline: false,
    },
  });

  return response.data;
};

export default coinGeckoClient;
