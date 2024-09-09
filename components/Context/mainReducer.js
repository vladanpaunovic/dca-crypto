import { useReducer } from "react";
import { useRouter } from "next/router";
import {
  generateDefaultInput,
  calculateDateRangeDifference,
} from "../../src/generateDefaultInput";
import { getGeneratedChartData } from "../../src/calculations/utils";

export const ACTIONS = {
  // Input actions
  UPDATE_COIN_ID: "UPDATE_COIN_ID",
  UPDATE_INVESTMENT: "UPDATE_INVESTMENT",
  UPDATE_INVESTMENT_INTERVAL: "UPDATE_INVESTMENT_INTERVAL",
  UPDATE_DATE_FROM: "DATE_FROM",
  UPDATE_DATE_TO: "DATE_TO",
  SET_COIN_LOADING: "SET_COIN_LOADING",

  UPDATE_ALL_INPUTS: "UPDATE_ALL_INPUTS",

  // Calculate
  CALCULATE_CHART_DATA: "CALCULATE_CHART_DATA",

  // Chart actions
  SET_CHART_DATA: "SET_CHART_DATA",
  SET_INSIGHTS: "SET_INSIGHTS",
  UPDATE_CAN_PROCEED: "UPDATE_CAN_PROCEED",
  UPDATE_ERROR: "UPDATE_ERROR",

  // Settings actions
  UPDATE_CURRENCY: "UPDATE_CURRENCY",
  UPDATE_LIST_OF_TOKENS: "UPDATE_LIST_OF_TOKENS",

  // AI Chat
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
};

export const reducer = (state, action) => {
  switch (action.type) {
    // Input
    case ACTIONS.UPDATE_COIN_ID: {
      const currentCoin = action.payload;

      return {
        ...state,
        currentCoin,
      };
    }
    case ACTIONS.UPDATE_INVESTMENT: {
      let investment = action.payload;

      if (investment < 0) {
        investment = 1;
      }

      if (investment === "") {
        investment = 1;
      }

      return {
        ...state,
        input: { ...state.input, investment },
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
        chart: action.payload,
      };
    }

    case ACTIONS.UPDATE_CAN_PROCEED: {
      return {
        ...state,
        canProceed: action.payload,
      };
    }

    case ACTIONS.UPDATE_ERROR: {
      return {
        ...state,
        chart: {
          ...state.chart,
          error: action.payload,
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

    case ACTIONS.CALCULATE_CHART_DATA: {
      const chartData = getGeneratedChartData({
        data: state.rawMarketData,
        input: state.input,
      });

      return {
        ...state,
        chart: chartData,
      };
    }

    case ACTIONS.UPDATE_ALL_INPUTS: {
      return {
        ...state,
        input: {
          ...state.input,
          dateFrom: action.payload.dateFrom,
          dateTo: action.payload.dateTo,
          duration: calculateDateRangeDifference(
            action.payload.dateFrom,
            action.payload.dateTo
          ),
          investment: action.payload.investment,
          investmentInterval: action.payload.investmentInterval,
          currentCoin: action.payload.coinId,
        },
      };
    }

    case ACTIONS.UPDATE_MESSAGES: {
      return {
        ...state,
        messages: action.payload,
      };
    }

    default: {
      throw new Error();
    }
  }
};

export const useMainReducer = ({ availableTokens, chart, currentCoin }) => {
  const router = useRouter();
  const DEFAULT_INPUT = generateDefaultInput(router.query);

  const initialState = {
    input: DEFAULT_INPUT,
    chart,
    settings: {
      currency: "usd",
      darkMode: false,
      availableTokens,
    },
    currentCoin,
    messages: [],
  };

  return useReducer(reducer, initialState);
};
