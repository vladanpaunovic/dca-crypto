import axios from "axios";
import qs from "qs";

const API_URL = "https://api.coingecko.com/api/v3/";

const coinGeckoClient = axios.create({ baseURL: API_URL });

export const fetchCoinGeckoMarkets = async (currency) => {
  const params = qs.stringify({
    vs_currency: currency || "usd",
    order: "market_cap_desc",
    per_page: 100,
    page: 1,
    sparkline: false,
  });

  const fetch_response = await fetch(`${API_URL}/coins/markets?${params}`);

  const response = await fetch_response.json();

  return response;
};

export default coinGeckoClient;
