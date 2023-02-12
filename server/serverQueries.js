import { setCookie } from "cookies-next";
import { FINGERPRING_ID } from "../common/fingerprinting";
import { canUserProceed, storeFingerprint } from "../server/redis";
import coinGeckoClient from "./coinGeckoClient";

const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;

export const getCoinById = async (coinId) => {
  let response;
  let output;

  try {
    response = await coinGeckoClient.get(`coins/${coinId}`, {
      params: {
        tickers: false,
        community_data: false,
        developer_data: false,
        localization: false,
      },
    });

    output = {
      ...response.data,
      image: response.data.image.thumb,
    };
  } catch (error) {
    output = null;
  }

  return output;
};

export const getCommonChartData = async (payload) => {
  let response;

  try {
    response = await coinGeckoClient.get(
      `https://api.coingecko.com/api/v3/coins/${payload.coinId}/market_chart/range`,
      {
        params: {
          from: convertDateStringToUnix(new Date("01-01-2010")),
          to: convertDateStringToUnix(new Date()),
          vs_currency: payload.currency,
        },
      }
    );
  } catch (error) {
    return {
      error: {
        message: error?.response?.data?.error,
        subheading: "Try changing the coin.",
      },
    };
  }

  if (!response.data.prices.length) {
    return {
      error: {
        message: `No market data yet for ${payload.coinId} yet`,
        subheading: "Try changing the coin or extending the investment period",
      },
    };
  }

  return response.data;
};
