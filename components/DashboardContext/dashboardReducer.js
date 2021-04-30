import { useReducer } from "react";

export const ACTIONS = {
  SET_MY_EXCHANGES: "SET_MY_EXCHANGES",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_MY_EXCHANGES:
      return { ...state, myExchanges: action.payload };
    default:
      throw new Error();
  }
};

const initialState = {
  myExchanges: [],
  myBots: [],
};

export default () => useReducer(reducer, initialState);
