import { useReducer } from "react";

export const ACTIONS = {
  SET_SELECTED_BOT: "SET_SELECTED_BOT",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_BOT:
      return { ...state, selectedBot: action.payload };
    default:
      throw new Error();
  }
};

const initialState = {
  selectedBot: null,
};

export default () => useReducer(reducer, initialState);
