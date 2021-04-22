import "../styles/globals.css";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { AppWrapper, useAppContext } from "../components/Context/Context";
import axios from "axios";
import { ACTIONS } from "../components/Context/mainReducer";
import { useState } from "react";

const queryClient = new QueryClient();

function App(props) {
  return (
    <AppWrapper>
      <QueryClientProvider client={queryClient}>
        <RenderComponent {...props} />
      </QueryClientProvider>
    </AppWrapper>
  );
}

const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

const RenderComponent = ({ Component, pageProps }) => {
  const { state, dispatch } = useAppContext();

  const { data, isLoading } = useQuery(
    "coins-init",
    async () => {
      const response = await axios.get(API_URL, {
        params: {
          vs_currency: state.settings.currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });

      return response.data;
    },
    {
      onSuccess: (data) => {
        dispatch({ type: ACTIONS.UPDATE_LIST_OF_TOKENS, payload: data });
      },
    }
  );

  if (!data || isLoading) {
    return (
      <div className={`${state.settings.darkMode ? "bg-gray-900 dark" : ""}`}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={`${state.settings.darkMode ? "bg-gray-900 dark" : ""}`}>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
