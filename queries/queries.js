import apiClient from "../server/apiClient";

export const searchCoin = async (query = "") => {
  const response = await apiClient.get(`coins/search?query=${query}`);

  const output = response.data.coins;

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

export const getFingerprintCanProceed = async (fingerprint, session) => {
  const response = await apiClient.get("fingerprint", {
    params: { fingerprint, session },
  });

  return response.data;
};
