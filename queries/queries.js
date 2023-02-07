import apiClient from "../server/apiClient";

export const getAllCoins = async () => {
  console.count("getAllCoins");

  const allCoins = require("../content/availableTokens_light.json");

  return allCoins;
};

export const getDCAChartData = async (payload) => {
  const response = await apiClient.post("calculate/dca", payload);

  return response.data;
};

export const getLumpSumChartData = async (payload) => {
  const response = await apiClient.post("calculate/lump-sum", payload);

  return response.data;
};

// @deprecated
export const getCommonChartData = async (payload) => {
  const response = await apiClient.post("calculate/common", payload);

  return response.data;
};

// @deprecated
export const getCoinById = async (coinId) => {
  const response = await apiClient.get(`coins/${coinId}`);

  return response.data;
};

export const searchCoin = async (query = "") => {
  const response = await apiClient.get(`coins/search?query=${query}`);

  const output = response.data.coins;

  return output;
};

export const getCoinPrice = async (coinId) => {
  const response = await apiClient.get(`coins/price/${coinId}`);

  const output = response.data[coinId]?.usd;

  return output;
};

export const getAllPricingProducts = async () => {
  const response = await fetch("/api/billing/products");
  const data = await response.json();

  return data;
};

export const createStripeSession = async (payload) => {
  const response = await apiClient.post("billing/session", payload);

  return response.data;
};

export const createStripeCustomerPortal = async (payload) => {
  const response = await apiClient.post("billing/customer-portal", payload);

  return response.data;
};

export const getFingerprintCanProceed = async (fingerprint, session) => {
  const response = await apiClient.get("fingerprint", {
    params: { fingerprint, session },
  });

  return response.data;
};
