import axios from "axios";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
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

export const useGetBalanceForNewBot = () => {
  const { state } = useDashboardContext();

  const getBalanceForNewBot = useQuery({
    queryFn: async () => {
      const credentials = state.newBot.exchange.api_requirements;
      const botExchange = state.newBot.exchange.available_exchange.identifier;
      const response = await apiClient.post(
        `/exchanges/${botExchange}/balance`,
        { credentials }
      );

      return response.data;
    },
    queryKey: `my-balanc-new-bot-${state.newBot.exchange?.available_exchange?.identifier}`,
    enabled: !!state.newBot.exchange?.api_requirements,
  });

  return getBalanceForNewBot;
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

export const useGetTickerForBot = () => {
  const { state, dispatch } = useDashboardContext();
  return useQuery({
    queryKey: `get-ticker-for-new-bot-${state.newBot.tradingPair?.value?.id}`,
    queryFn: async () => {
      const credentials = state.newBot.exchange.api_requirements;
      const exchangeId = state.newBot.exchange.available_exchange.identifier;

      const response = await apiClient.get(
        `/exchanges/${exchangeId}/fetch-ticker`,
        {
          params: {
            credentials,
            symbol: state.newBot.tradingPair.value.symbol,
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      dispatch({
        type: ACTIONS.SET_MINIMUM_AMOUNT,
        payload:
          state.newBot.tradingPair?.value?.limits?.amount?.min *
          data.close *
          1.1,
      });
    },
    enabled: !!state.newBot.tradingPair?.value?.id,
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
  const { state } = useDashboardContext();
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

export const useGetMarketsForSelectedExchange = () => {
  const { state, dispatch } = useDashboardContext();
  const exchange = state.newBot.exchange;

  const getMarkets = useQuery({
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

  useEffect(() => {
    if (getMarkets.isSuccess) {
      dispatch({
        type: ACTIONS.SET_TRADING_PAIR,
        payload: {
          value: getMarkets.data[0],
          label: getMarkets.data[0].symbol,
        },
      });
    }
  }, [getMarkets.isSuccess, exchange.available_exchange.identifier]);

  return getMarkets;
};

export const useMyExchanges = () => {
  const [session] = useSession();
  return useQuery("only-my-exchanges", async () => {
    const response = await cmsClient(session.accessToken).get("/exchanges");
    return response.data;
  });
};

export const useAvailableExchanges = () => {
  return useQuery("available-exchanges", async () => {
    const response = await cmsClient().get("/available-exchanges");
    return response.data;
  });
};

export const useAllExchanges = () => {
  const myExchanges = useMyExchanges();
  const availableExchanges = useAvailableExchanges();

  if (
    myExchanges.isLoading ||
    !myExchanges.data ||
    availableExchanges.isLoading ||
    !availableExchanges.data
  ) {
    return [myExchanges, availableExchanges];
  }

  const myExchangeIds = new Set(
    myExchanges.data.map((a) => a.available_exchange._id)
  );

  const filtered = availableExchanges.data.filter(
    (ex) => !myExchangeIds.has(ex._id)
  );

  return [myExchanges, { ...availableExchanges, data: filtered }];
};

export const useAddTradingBot = () => {
  const [session] = useSession();
  const { dispatch } = useDashboardContext();

  return useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).post("/trading-bots", payload),
    mutationKey: "add-bot",
    onSettled: async (data) => {
      await queryClient.refetchQueries(["my-bots"]);
      dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: data.data });
      dispatch({ type: ACTIONS.SET_IS_MODAL_OPEN, payload: false });
    },
  });
};

export const useAddExchange = () => {
  const [session] = useSession();
  const { dispatch } = useDashboardContext();
  return useMutation({
    mutationFn: async (payload) =>
      await cmsClient(session.accessToken).post("/exchanges", payload),
    mutationKey: "add-exchange",
    onSettled: async (data) => {
      await queryClient.refetchQueries(["only-my-exchanges"]);

      dispatch({
        type: ACTIONS.CLEAR_NEW_EXCHANGE,
      });

      dispatch({
        type: ACTIONS.SET_EXCHANGE,
        payload: { ...data.data, isActive: true },
      });
    },
  });
};

export const useGetMyBots = () => {
  const [session] = useSession();
  const { state, dispatch } = useDashboardContext();

  const myBots = useQuery(
    "my-bots",
    async () => {
      const response = await cmsClient(session.accessToken).get(
        "/trading-bots"
      );

      return response.data;
    },
    {
      refetchInterval: 10000,
      onSettled: (data) => {
        if (state.selectedBot) {
          const currentBot = data.find(
            (bot) => bot.id === state.selectedBot.id
          );

          dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: currentBot });
        }

        if (!state.selectedBot && data.length) {
          dispatch({ type: ACTIONS.SET_SELECTED_BOT, payload: data[0] });
        }
      },
    }
  );

  return myBots;
};

export const useAvailablePlans = () => {
  const availablePlans = useQuery("available-plans", async () => {
    const response = await cmsClient().get("/plans");

    return response.data;
  });

  return availablePlans;
};

export const useMySubscription = () => {
  const [session] = useSession();
  const mySubscription = useQuery("my-subscription", async () => {
    const response = await cmsClient(session.accessToken).get("/subscriptions");

    return response.data;
  });

  return mySubscription;
};

export const useMyTransaction = () => {
  const [session] = useSession();
  const myTransaction = useQuery(
    "my-transactions",
    async () => {
      const response = await cmsClient(session.accessToken).get(
        "/transactions"
      );

      return response.data;
    },
    { refetchInterval: 7000 }
  );

  return myTransaction;
};

export const useResendEmailConfirmation = () => {
  const resendEmailConfirmation = useMutation(
    "resend-email-confirmation",
    async (payload) => {
      const response = await cmsClient().post(
        "/auth/send-email-confirmation",
        payload
      );

      return response.data;
    }
  );

  return resendEmailConfirmation;
};

export const useValidateReferralCode = (referralCode) => {
  const validateReferralCode = useQuery("validate-referral-code", async () => {
    const response = await cmsClient().get("/referrals/validate", {
      params: { referralCode },
    });

    return response.data;
  });

  return validateReferralCode;
};

export const useMyReferrals = () => {
  const [session] = useSession();
  const validateReferralCode = useQuery("my-referrals", async () => {
    const response = await cmsClient(session.accessToken).get("/referrals/me");

    return response.data;
  });

  return validateReferralCode;
};

export const useUpdateUser = () => {
  const [session] = useSession();

  return useMutation({
    mutationFn: async (payload) => {
      return await cmsClient(session.accessToken).put(
        `/users/${session.user.id}`,
        payload
      );
    },
    mutationKey: "update-user",
  });
};
