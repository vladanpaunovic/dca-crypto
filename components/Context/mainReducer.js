import { useReducer } from "react";
import { useRouter } from "next/router";
import {
  generateDefaultInput,
  calculateDateRangeDifference,
} from "../../common/generateDefaultInput";

export const ACTIONS = {
  // Input actions
  UPDATE_COIN_ID: "UPDATE_COIN_ID",
  UPDATE_INVESTMENT: "UPDATE_INVESTMENT",
  UPDATE_INVESTMENT_INTERVAL: "UPDATE_INVESTMENT_INTERVAL",
  UPDATE_DATE_FROM: "DATE_FROM",
  UPDATE_DATE_TO: "DATE_TO",
  SET_COIN_LOADING: "SET_COIN_LOADING",

  // Chart actions
  SET_CHART_DATA: "SET_CHART_DATA",
  SET_INSIGHTS: "SET_INSIGHTS",
  UPDATE_CAN_PROCEED: "UPDATE_CAN_PROCEED",

  // Settings actions
  UPDATE_CURRENCY: "UPDATE_CURRENCY",
  UPDATE_LIST_OF_TOKENS: "UPDATE_LIST_OF_TOKENS",
};

const reducer = (state, action) => {
  switch (action.type) {
    // Input
    case ACTIONS.UPDATE_COIN_ID: {
      const currentCoin = action.payload;

      return {
        ...state,
        input: {
          ...state.input,
          coinId: currentCoin.id,
        },
        currentCoin,
      };
    }
    case ACTIONS.UPDATE_INVESTMENT: {
      return {
        ...state,
        input: { ...state.input, investment: action.payload },
      };
    }
    case ACTIONS.UPDATE_INVESTMENT_INTERVAL: {
      return {
        ...state,
        input: { ...state.input, investmentInterval: action.payload },
      };
    }
    case ACTIONS.UPDATE_DATE_FROM: {
      return {
        ...state,
        input: {
          ...state.input,
          dateFrom: action.payload,
          duration: calculateDateRangeDifference(
            state.input.dateFrom,
            state.input.dateTo
          ),
        },
      };
    }
    case ACTIONS.UPDATE_DATE_TO: {
      return {
        ...state,
        input: {
          ...state.input,
          dateTo: action.payload,
          duration: calculateDateRangeDifference(
            state.input.dateFrom,
            state.input.dateTo
          ),
        },
      };
    }

    case ACTIONS.SET_COIN_LOADING: {
      return {
        ...state,
        input: {
          ...state.input,
          isLoading: action.payload,
        },
      };
    }

    // Chart
    case ACTIONS.SET_CHART_DATA: {
      return {
        ...state,
        chart: {
          ...state.chart,
          data: action.payload.chartData,
          canProceed: action.payload.canProceed,
          insights: action.payload.insights,
        },
      };
    }

    case ACTIONS.UPDATE_CAN_PROCEED: {
      return {
        ...state,
        chart: {
          ...state.chart,
          canProceed: action.payload,
        },
      };
    }
    // Settings
    case ACTIONS.UPDATE_CURRENCY: {
      return {
        ...state,
        settings: { ...state.settings, currency: action.payload },
      };
    }
    case ACTIONS.UPDATE_LIST_OF_TOKENS: {
      return {
        ...state,
        settings: { ...state.settings, availableTokens: action.payload },
      };
    }

    default: {
      throw new Error();
    }
  }
};

export const useMainReducer = ({ availableTokens, chartData, currentCoin }) => {
  const router = useRouter();
  const DEFAULT_INPUT = generateDefaultInput(router.query);

  const initialState = {
    input: DEFAULT_INPUT,
    chart: {
      data: chartData ? chartData.chartData : [],
      insights: chartData ? chartData.insights : {},
      canProceed: chartData ? chartData.canProceed : {},
    },
    settings: {
      currency: "usd",
      darkMode: false,
      availableTokens,
    },
    currentCoin,
  };

  return useReducer(reducer, initialState);
};
