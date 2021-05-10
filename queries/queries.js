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

  const query = useQuery({
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

  return query;
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

export const useRemoveTradingBot = () => {
  const [session] = useSession();
  const { dispatch } = useDashboardContext();

  const mutation = useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).delete(`/trading-bots/${payload}`),
    mutationKey: "remove-bot",
    onSettled: async () => {
      await queryClient.refetchQueries(["my-bots"]);
      dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: null });
    },
  });

  return mutation;
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
