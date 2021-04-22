import { useReducer, useEffect } from "react";
import dayjs from "dayjs";
import store from "store";

export const ACTIONS = {
  // Input actions
  UPDATE_COIN_ID: "UPDATE_COIN_ID",
  UPDATE_INVESTMENT: "UPDATE_INVESTMENT",
  UPDATE_INVESTMENT_INTERVAL: "UPDATE_INVESTMENT_INTERVAL",
  UPDATE_DATE_FROM: "DATE_FROM",
  UPDATE_DATE_TO: "DATE_TO",

  // Chart actions
  SET_CHART_DATA: "SET_CHART_DATA",
  SET_INSIGHTS: "SET_INSIGHTS",

  // Settings actions
  UPDATE_CURRENCY: "UPDATE_CURRENCY",
  TOGGLE_DARK_MODE: "TOGGLE_DARK_MODE",
};

const reducer = (state, action) => {
  switch (action.type) {
    // Input
    case ACTIONS.UPDATE_COIN_ID:
      return {
        ...state,
        input: {
          ...state.input,
          coinId: action.payload,
          coinName: action.name,
        },
      };
    case ACTIONS.UPDATE_INVESTMENT:
      return {
        ...state,
        input: { ...state.input, investment: action.payload },
      };
    case ACTIONS.UPDATE_INVESTMENT_INTERVAL:
      return {
        ...state,
        input: { ...state.input, investmentInterval: action.payload },
      };
    case ACTIONS.UPDATE_DATE_FROM:
      return { ...state, input: { ...state.input, dateFrom: action.payload } };
    case ACTIONS.UPDATE_DATE_TO:
      return { ...state, input: { ...state.input, dateTo: action.payload } };

    // Chart
    case ACTIONS.SET_CHART_DATA:
      return {
        ...state,
        chart: {
          ...state.chart,
          data: action.payload.chartData,
          insights: action.payload.insights,
        },
      };

    // Settings
    case ACTIONS.UPDATE_CURRENCY:
      return {
        ...state,
        settings: { ...state.settings, currency: action.payload },
      };
    case ACTIONS.TOGGLE_DARK_MODE:
      if (state.darkMode) {
        store.remove("theme");
      } else {
        store.set("theme", "dark");
      }
      return {
        ...state,
        settings: { ...state.settings, darkMode: !state.settings.darkMode },
      };
    default:
      throw new Error();
  }
};

const firstDayOfTheYear = new Date(new Date().getFullYear(), 0, 1);

export const availableInvestmentIntervals = [
  { label: "Daily", value: "1" },
  { label: "Weekly", value: "7" },
  { label: "Bi-weekly", value: "14" },
  { label: "Monthly", value: "30" },
  { label: "Custom", value: "custom" },
];

const DEFAULT_INPUT = {
  coinId: "bitcoin",
  coinName: "Bitcoin",
  investment: 100,
  investmentInterval: availableInvestmentIntervals[1].value,
  dateFrom: dayjs(firstDayOfTheYear).format("YYYY-MM-DD"),
  dateTo: dayjs().format("YYYY-MM-DD"),
};

const initialState = {
  input: DEFAULT_INPUT,
  chart: {
    data: [],
    insights: {},
  },
  settings: {
    currency: "usd",
    darkMode: false,
    token: {},
  },
};

export const useMainReducer = () => {
  const useMainReducerRaw = useReducer(reducer, initialState);

  useEffect(() => {
    const [, dispatch] = useMainReducerRaw;
    if (store.get("theme") === "dark") {
      dispatch({ type: ACTIONS.TOGGLE_DARK_MODE });
    }
  }, []);

  return useMainReducerRaw;
};
