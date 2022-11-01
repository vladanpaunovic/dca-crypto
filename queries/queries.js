import axios from "axios";
import apiClient from "../server/apiClient";

const API_URL = "https://api.coingecko.com/api/v3/";

const coinGecko = axios.create({ baseURL: API_URL });

export const getAllCoins = async (currency) => {
  const response = await coinGecko.get("coins/markets", {
    params: {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      sparkline: false,
    },
  });

  return response.data;
};

export const getDCAChartData = async (payload) => {
  const response = await apiClient.post("calculate/dca", payload);

  return response.data;
};

export const getLumpSumChartData = async (payload) => {
  const response = await apiClient.post("calculate/lump-sum", payload);

  return response.data;
};

export const getCoinById = async (coinId) => {
  const response = await coinGecko.get(`coins/${coinId}`, {
    params: {
      tickers: false,
      market_data: false,
      community_data: false,
      developer_data: false,
      localization: false,
    },
  });

  const output = {
    name: response.data.name,
    symbol: response.data.symbol,
    id: response.data.id,
    image: response.data.image.thumb,
    market_cap_rank: response.data.market_cap_rank,
  };

  return output;
};

export const searchCoin = async (query = "") => {
  const response = await coinGecko.get(`search/?query=${query}`);

  const output = response.data.coins;

  return output;
};

export const getCoinPrice = async (coinId) => {
  const response = await coinGecko.get(
    `simple/price?ids=${coinId}&vs_currencies=usd`
  );

  const output = response.data[coinId]?.usd;

  return output;
};

export const getAllPricingProducts = async (payload) => {
  const response = await apiClient.post("billing/products", payload);

  return response.data;
};

export const createStripeSession = async (payload) => {
  const response = await apiClient.post("billing/session", payload);

  return response.data;
};

export const createStripeCustomerPortal = async (payload) => {
  const response = await apiClient.post("billing/customer-portal", payload);

  return response.data;
};
