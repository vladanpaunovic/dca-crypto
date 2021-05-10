import axios from "axios";
import { useSession } from "next-auth/client";
import { useMutation, useQuery } from "react-query";
import { useDashboardContext } from "../components/DashboardContext/DashboardContext";
import { ACTIONS } from "../components/DashboardContext/dashboardReducer";
import { queryClient } from "../pages/_app";
import apiClient from "../server/apiClient";
import cmsClient from "../server/cmsClient";

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

export const useGetTickers = () => {
  const { state } = useDashboardContext();

  const refetchInterval = {
    minute: 60000,
    hour: 3600000,
    day: 84000000,
    week: 588000000,
  };

  return useQuery({
    queryKey: `get-tickers-${state.selectedBot.id}`,
    queryFn: async () => {
      const credentials = state.selectedBot.exchange.api_requirements;
      const exchangeId = state.selectedBot.available_exchange.identifier;

      const response = await apiClient.get(
        `/exchanges/${exchangeId}/fetch-tickers`,
        {
          params: {
            credentials,
            symbol: state.selectedBot.trading_pair,
            since: state.selectedBot.createdAt,
            interval_type: state.selectedBot.interval_type,
            investing_interval: state.selectedBot.investing_interval,
          },
        }
      );

      return response.data;
    },
    enabled: !!state.selectedBot,
    refetchInterval: refetchInterval[state.selectedBot.interval_type],
  });
};

export const useGetBalance = (botExchange) => {
  const { state } = useDashboardContext();
  const credentials = state.selectedBot.exchange.api_requirements;

  return useQuery({
    queryFn: async () => {
      const response = await apiClient.post(
        `/exchanges/${botExchange}/balance`,
        { credentials }
      );

      return response.data;
    },
    queryKey: `my-balance-${botExchange}`,
  });
};

export const useGetTicker = ({ state, onSuccess }) => {
  return useQuery({
    queryKey: state.trading_pair
      ? `get-ticker-${state.trading_pair.id}`
      : "get-ticket-init",
    queryFn: async () => {
      const credentials = state.exchange.api_requirements;
      const exchangeId = state.exchange.available_exchange.identifier;

      const response = await apiClient.get(
        `/exchanges/${exchangeId}/fetch-ticker`,
        { params: { credentials, symbol: state.trading_pair.symbol } }
      );

      return response.data;
    },
    onSuccess: (data) => {
      onSuccess({
        ...state,
        origin_currency_amount:
          state.trading_pair.limits.amount.min * data.close * 1.1,
      });
    },
    enabled: !!state.trading_pair && !!state.trading_pair.id,
  });
};

export const useRemoveTradingBot = () => {
  const [session] = useSession();
  const { dispatch } = useDashboardContext();

  return useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).delete(`/trading-bots/${payload}`),
    mutationKey: "remove-bot",
    onSettled: async () => {
      await queryClient.refetchQueries(["my-bots"]);
      dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: null });
    },
  });
};

export const useUpdateTradingBot = () => {
  const [session] = useSession();
  return useMutation({
    mutationFn: async (payload) => {
      return await cmsClient(session.accessToken).put(
        `/trading-bots/${state.selectedBot.id}`,
        payload
      );
    },
    mutationKey: "update-bot",
    onSuccess: async () => {
      await queryClient.refetchQueries(["my-bots"]);
    },
  });
};

export const useGetMarkets = (exchange) => {
  const { state } = useDashboardContext();

  return useQuery({
    queryKey: `get-markets-${
      exchange ? exchange.available_exchange.identifier : "init"
    }`,
    queryFn: async () => {
      const credentials = exchange.api_requirements;
      const exchangeId = exchange.available_exchange.identifier;

      const response = await apiClient.get(
        `/exchanges/${exchangeId}/get-markets`,
        { params: { credentials } }
      );

      return response.data;
    },
    enabled: !!exchange,
  });
};
