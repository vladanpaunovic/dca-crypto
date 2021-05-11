import { useReducer } from "react";

export const ACTIONS = {
  SET_SELECTED_BOT: "SET_SELECTED_BOT",
  SET_EXCHANGE: "SET_EXCHANGE",
  SET_TRADING_PAIR: "SET_TRADING_PAIR",
  SET_BOT_INVESTMENT: "SET_BOT_INVESTMENT",
  SET_BOT_INVESTMENT_INTERVAL: "SET_BOT_INVESTMENT_INTERVAL",
  SET_BOT_INTERVAL_TYPE: "SET_BOT_INTERVAL_TYPE",
  SET_MINIMUM_AMOUNT: "SET_MINIMUM_AMOUNT",
  SET_IS_MODAL_OPEN: "SET_IS_MODAL_OPEN",
  CLEAR_NEW_EXCHANGE: "CLEAR_NEW_EXCHANGE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_BOT:
      return { ...state, selectedBot: action.payload };
    case ACTIONS.SET_EXCHANGE:
      if (action.payload.isActive) {
        return {
          ...state,
          newExchange: null,
          newBot: { ...state.newBot, exchange: action.payload },
        };
      }

      return {
        ...state,
        newExchange: action.payload,
      };

    case ACTIONS.CLEAR_NEW_EXCHANGE:
      return {
        ...state,
        newExchange: null,
      };
    case ACTIONS.SET_TRADING_PAIR:
      return {
        ...state,
        newBot: { ...state.newBot, tradingPair: action.payload },
      };
    case ACTIONS.SET_BOT_INVESTMENT:
      return {
        ...state,
        newBot: { ...state.newBot, investment: action.payload },
      };
    case ACTIONS.SET_BOT_INVESTMENT_INTERVAL:
      return {
        ...state,
        newBot: { ...state.newBot, investment_interval: action.payload },
      };
    case ACTIONS.SET_BOT_INTERVAL_TYPE:
      return {
        ...state,
        newBot: { ...state.newBot, interval_type: action.payload },
      };

    case ACTIONS.SET_MINIMUM_AMOUNT:
      return {
        ...state,
        newBot: { ...state.newBot, minimum_amount: action.payload },
      };
    case ACTIONS.SET_IS_MODAL_OPEN:
      return {
        ...state,
        newBot: { ...state.newBot, isModalOpen: action.payload },
      };

    default:
      throw new Error();
  }
};

const initialState = {
  selectedBot: null,
  newBot: {
    exchange: null,
    tradingPair: null,
    investment: 100,
    investment_interval: 7,
    interval_type: "day",
    minimum_amount: null,
    isModalOpen: false,
  },
  newExchange: null,
};

const dashboardReducer = () => useReducer(reducer, initialState);

export default dashboardReducer;
